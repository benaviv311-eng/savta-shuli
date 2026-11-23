(function () {
  "use strict";
  const section = document.getElementById("quotes");
  if (!section || document.getElementById("eyal-patent-quote")) return;

  // An identical byte-for-byte copy of the uploaded illustration already lives
  // in the repository. Reuse it, with no crop, redraw, compression or resizing.
  const original = "assets/comics/eyal-panel-4.png";
  const card = document.createElement("article");
  card.className = "eyal-quote-feature";
  card.id = "eyal-patent-quote";

  const descriptor = document.createElement("small");
  descriptor.textContent = "הזיכרון של אייל וסבתא שולי";

  const heading = document.createElement("h3");
  heading.textContent = "״פטנט!״";

  const link = document.createElement("a");
  link.className = "eyal-quote-art";
  link.href = original;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", "פתיחת איור ״פטנט!״ באיכות המקורית");

  const image = document.createElement("img");
  image.src = original;
  image.alt = "אייל בתחפושת הפלונטר, עם מדליית ארד וכובע צבעוני, קורא בגאווה: ״פטנט!״";
  image.loading = "lazy";
  image.decoding = "async";
  image.width = 1536;
  image.height = 1024;
  link.appendChild(image);

  const hint = document.createElement("p");
  hint.className = "eyal-quote-hint";
  hint.textContent = "לחצו על האיור לצפייה בגודל מלא";

  card.append(descriptor, heading, link, hint);
  const previous = section.querySelector(".quotehero");
  if (previous) previous.insertAdjacentElement("afterend", card);
  else section.appendChild(card);
})();