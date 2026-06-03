"use client";

type PhoneLinkProps = {
  phone: string;
};

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function PhoneLink({ phone }: PhoneLinkProps) {
  return (
    <a
      className="text-link phone-link"
      href={telHref(phone)}
      onClick={(event) => {
        const confirmed = window.confirm(`${phone} に電話をかけますか？`);
        if (!confirmed) event.preventDefault();
      }}
    >
      {phone}
    </a>
  );
}
