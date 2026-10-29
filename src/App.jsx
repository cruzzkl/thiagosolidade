import React, { useEffect, useRef, useState } from "react";

export default function App() {
  const aboutRef = useRef(null);
  const appointmentRef = useRef(null);
  const [photoAvailable, setPhotoAvailable] = useState(true);
  const [appointmentDate, setAppointmentDate] = useState("");

  function handleAppointmentDateChange(event) {
    const input = event.currentTarget;
    const digits = input.value.replace(/\D/g, "").slice(0, 8);
    const formattedDate = [
      digits.slice(0, 2),
      digits.slice(2, 4),
      digits.slice(4, 8),
    ].filter(Boolean).join("/");

    setAppointmentDate(formattedDate);

    if (digits.length < 8) {
      input.setCustomValidity("");
      return;
    }

    const day = Number(digits.slice(0, 2));
    const month = Number(digits.slice(2, 4));
    const year = Number(digits.slice(4, 8));
    const parsedDate = new Date(year, month - 1, day);
    const isValidDate =
      parsedDate.getFullYear() === year &&
      parsedDate.getMonth() === month - 1 &&
      parsedDate.getDate() === day;

    input.setCustomValidity(isValidDate ? "" : "Informe uma data válida.");
  }

  function handleAppointmentSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const phone = formData.get("phone");
    const service = formData.get("service");
    const date = formData.get("date");
    const time = formData.get("time");
    const notes = formData.get("notes");
    const formattedDate = date || "A combinar";
    const formattedTime = time || "A combinar";
    const message = [
      "Olá, gostaria de solicitar um agendamento de fisioterapia.",
      "",
      `Nome: ${name}`,
      `Telefone: ${phone}`,
      `Atendimento: ${service}`,
      `Data preferida: ${formattedDate}`,
      `Horário preferido: ${formattedTime}`,
      ...(notes ? [`Observações: ${notes}`] : []),
    ].join("\n");
    const whatsappUrl = `https://wa.me/5571984301033?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    const section = aboutRef.current;

    if (!section) {
      return undefined;
    }

    const content = section.querySelector(".about__inner");
    const portrait = section.querySelector(".about__portrait");
    const textElements = section.querySelectorAll(
      ".about__content > p, .about__content > h2",
    );
    let frameId = 0;

    const updateProgress = () => {
      const viewportHeight = window.innerHeight;
      const sectionTop = section.getBoundingClientRect().top;
      const start = viewportHeight * 0.95;
      const end = Math.max(0, viewportHeight - section.offsetHeight);
      const progress = Math.min(1, Math.max(0, (start - sectionTop) / (start - end)));
      const easedProgress = progress * progress * (3 - 2 * progress);

      section.style.setProperty(
        "--about-reveal",
        `${easedProgress * 100}%`,
      );

      textElements.forEach((element, index) => {
        const textProgress = Math.min(1, Math.max(0, progress * 2.1 - index * 0.15));
        const easedTextProgress = textProgress * textProgress * (3 - 2 * textProgress);

        element.style.transform = `scale(${0.92 + easedTextProgress * 0.08})`;
      });

      const colorChannel = (from, to) => Math.round(from + (to - from) * progress);
      const portraitProgress = Math.min(1, Math.max(0, (progress - 0.18) / 0.72));

      section.style.color = `rgb(${colorChannel(220, 48)}, ${colorChannel(228, 56)}, ${colorChannel(216, 48)})`;
      content.style.transform = `translate3d(${(1 - progress) * 64}px, 0, 0)`;
      portrait.style.opacity = portraitProgress.toFixed(3);
      portrait.style.transform = `translate3d(${(portraitProgress - 1) * 48}px, 0, 0)`;
    };

    const scheduleUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        updateProgress();
      });
    };

    updateProgress();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const section = appointmentRef.current;

    if (!section) {
      return undefined;
    }

    let frameId = 0;
    let introRevealed = false;
    let formRevealed = false;

    const updateProgress = () => {
      const viewportHeight = window.innerHeight;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const aboutSection = aboutRef.current;
      const hasLeftAbout =
        aboutSection &&
        aboutSection.getBoundingClientRect().bottom <=
          Math.max(80, viewportHeight * 0.15);
      const atPageEnd =
        Math.ceil(window.scrollY + viewportHeight) >=
        document.documentElement.scrollHeight - 2;

      introRevealed =
        introRevealed || reducedMotion || hasLeftAbout || atPageEnd;
      formRevealed = formRevealed || reducedMotion || atPageEnd;

      section.classList.toggle(
        "appointment--intro-revealed",
        introRevealed,
      );
      section.classList.toggle("appointment--revealed", formRevealed);
    };

    const scheduleUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        updateProgress();
      });
    };

    updateProgress();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <>
      <main>
      <section className="splash">
        <div className="brand" aria-label="Thiago Solidade, fisioterapeuta">
          <h1 className="brand__name">Thiago Solidade</h1>
          <p className="brand__title">Fisioterapeuta</p>
          <span className="brand__scroll" aria-hidden="true">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14m-7-7 7 7 7-7" />
            </svg>
          </span>
          <p className="brand__intro">
            Olá, meu nome é Thiago Lima. Sou fisioterapeuta e acredito em um
            cuidado próximo, humano e feito com calma, respeitando a história e
            o ritmo de cada pessoa.
          </p>
        </div>
      </section>
      <section
        className="about"
        id="sobre"
        aria-labelledby="about-title"
        ref={aboutRef}
      >
        <div className="about__inner">
          <figure className="about__portrait">
            {photoAvailable ? (
              <img
                src="/images/thiago-solidade.png"
                alt="Thiago Solidade, fisioterapeuta"
                onError={() => setPhotoAvailable(false)}
              />
            ) : (
              <div className="about__portrait-placeholder">
                <span className="about__portrait-initials">TS</span>
                <span className="about__portrait-note">
                  Adicione sua foto em
                  <br />
                  public/images/thiago-solidade.png
                </span>
              </div>
            )}
          </figure>
          <div className="about__content">
            <p className="about__eyebrow">
              Sobre mim
            </p>
            <h2 id="about-title">
              Cuidado atento.
              <br />
              <em>Movimento com propósito.</em>
            </h2>
            <p>
              Acredito que cada pessoa tem uma história e um ritmo próprios.
              Por isso, um bom cuidado começa com escuta, atenção e objetivos
              construídos em conjunto.
            </p>
            <p>
              Minha proposta é acompanhar você com presença e respeito em cada
              etapa, valorizando o progresso possível e o que faz sentido para
              a sua vida.
            </p>
            <div className="about__values" aria-label="Valores do atendimento">
              <span>Escuta</span>
              <span>Individualidade</span>
              <span>Movimento</span>
            </div>
          </div>
        </div>
      </section>
      <section
        className="appointment"
        id="agendamento"
        aria-labelledby="appointment-title"
        ref={appointmentRef}
      >
        <div className="appointment__inner">
          <div className="appointment__intro">
            <p className="appointment__eyebrow">Vamos conversar</p>
            <h2 id="appointment-title">
              Seu próximo passo começa com uma <em>conversa.</em>
            </h2>
            <p>
              Preencha o formulário com seus dados e preferências. A mensagem
              será preparada no WhatsApp para você revisar e enviar.
            </p>
          </div>

          <form className="appointment__form" onSubmit={handleAppointmentSubmit}>
            <label>
              Nome completo
              <input
                autoComplete="name"
                name="name"
                placeholder="Como podemos chamar você?"
                required
              />
            </label>

            <label>
              Seu telefone
              <input
                autoComplete="tel"
                inputMode="tel"
                name="phone"
                placeholder="(00) 00000-0000"
                required
                type="tel"
              />
            </label>

            <label>
              Tipo de atendimento
              <select defaultValue="" name="service" required>
                <option disabled value="">Selecione uma opção</option>
                <option>Avaliação fisioterapêutica</option>
                <option>Reabilitação</option>
                <option>Orientação sobre atendimento</option>
                <option>Outro</option>
              </select>
            </label>

            <div className="appointment__date-row">
              <label>
                Data preferida
                <input
                  autoComplete="off"
                  inputMode="numeric"
                  maxLength={10}
                  name="date"
                  onChange={handleAppointmentDateChange}
                  pattern="\d{2}/\d{2}/\d{4}"
                  placeholder="DD/MM/AAAA"
                  title="Use o formato DD/MM/AAAA."
                  type="text"
                  value={appointmentDate}
                />
              </label>
              <label>
                Horário preferido
                <input name="time" type="time" />
              </label>
            </div>

            <label>
              Observações <span>(opcional)</span>
              <textarea
                name="notes"
                placeholder="Conte brevemente como podemos ajudar."
                rows="3"
              />
            </label>

            <button className="appointment__submit" type="submit">
              Continuar pelo WhatsApp
              <span aria-hidden="true">↗</span>
            </button>
            <p className="appointment__privacy">
              O WhatsApp será aberto com a mensagem pronta. Você confirma o envio.
            </p>
          </form>
        </div>
      </section>
      </main>
      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} Thiago Solidade. Todos os direitos reservados.
        </p>
      </footer>
    </>
  );
}
