// utils/validators.ts

export const isValidName = (name: string, minLength: number = 3) => {
  const noLeadingOrTrailing = name === name.trim();
  const trimmed = name.trim();
  const noExtraSpaces = !/\s{2,}/.test(trimmed);

  return (
    trimmed !== "" &&
    /^[\p{L}\s]+$/u.test(trimmed) &&
    trimmed.length >= minLength &&
    noLeadingOrTrailing &&
    noExtraSpaces
  );
};

export const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/
    const domainMatch = email.match(/@([^.]+)\./)
    const extensionMatch = email.match(/\.([a-z]{2,})$/)
    const domain = domainMatch?.[1]?.toLowerCase()
    const extension = extensionMatch?.[1]?.toLowerCase()
    const noConsecutiveDots = !email.includes("..")
    const noLeadingOrTrailing = email === email.trim()
    const noLeadingDotOrAt = !email.startsWith(".") && !email.startsWith("@")

    const acceptedDomains = ['gmail', 'googlemail', 'yahoo', 'outlook', 'hotmail', 'icloud', 'mail']
    const acceptedExtensions = ['com', 'net', 'org', 'co', 'edu', 'gov', 'ph']

    return (
        emailRegex.test(email) &&
        domain && acceptedDomains.includes(domain) &&
        extension && acceptedExtensions.includes(extension) &&
        noConsecutiveDots &&
        noLeadingOrTrailing &&
        noLeadingDotOrAt
    )
}

export const isValidPassword = (password: string) => password.length >= 8

export const isPasswordMatch = (password: string, confirm: string) =>
    password !== "" && password === confirm
