// Patient demographics and test date at the top of the report. Dates are
// typed as mm/dd/yyyy; the slashes are filled in while typing.

const pad = (n) => String(n).padStart(2, "0");

function today() {
  const d = new Date();
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
}

// 01022024 -> 01/02/2024, and 1/2/2024 -> 01/02/2024 (a typed slash ends a
// one-digit month or day). Only reformats while the caret is at the end, so
// editing the middle of a date doesn't throw the caret around.
function formatDateInput(input) {
  const { value } = input;
  if (input.selectionStart !== value.length) return;
  const segments = value.split("/");
  const digits = segments
    .map((segment, i) => {
      const d = segment.replace(/\D/g, "");
      const closed = i < segments.length - 1 && i < 2;
      return closed && d.length === 1 ? `0${d}` : d;
    })
    .join("")
    .slice(0, 8);
  let formatted = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)]
    .filter(Boolean)
    .join("/");
  if (value.endsWith("/") && (digits.length === 2 || digits.length === 4)) {
    formatted += "/";
  }
  input.value = formatted;
}

// mm/dd/yyyy -> yyyy-mm-dd, or "" if it isn't a full date
function isoDate(value) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[1]}-${match[2]}` : "";
}

// The browser's Save as PDF uses the page title as the default file name,
// e.g. "Audiogram - Doe, Jane - 2026-10-01".
function reportFileName() {
  const field = (id) => document.getElementById(id).value.trim();
  const name = [field("pt_last"), field("pt_first")].filter(Boolean).join(", ");
  const date = isoDate(field("test_date"));
  return ["Audiogram", name, date].filter(Boolean).join(" - ");
}

// Patient and test details for exports. Unset fields are null.
export function getPatientInfo() {
  const field = (id) => {
    const value = document.getElementById(id).value.trim();
    return value === "" || value === "blank" ? null : value;
  };
  return {
    patient: {
      lastName: field("pt_last"),
      firstName: field("pt_first"),
      dob: field("pt_dob"),
      id: field("pt_id"),
    },
    test: {
      date: field("test_date"),
      transducer: field("select_transducer"),
      reliability: field("Reliability"),
    },
  };
}

export function initPatient() {
  document.getElementById("test_date").value = today();

  document.querySelectorAll(".patient-field [data-date]").forEach((input) => {
    input.addEventListener("input", (event) => {
      if (event.inputType?.startsWith("delete")) return;
      formatDateInput(input);
    });
  });

  const pageTitle = document.title;
  window.addEventListener("beforeprint", () => {
    document.title = reportFileName();
  });
  window.addEventListener("afterprint", () => {
    document.title = pageTitle;
  });
}
