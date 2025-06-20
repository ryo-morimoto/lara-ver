# Security Policy

## Supported Versions

Currently, we support the latest version of Lara Ver. When security issues are discovered, we will address them in new releases.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| Older   | :x:                |

## Reporting a Vulnerability

We take the security of Lara Ver seriously. If you have discovered a security vulnerability, we appreciate your help in disclosing it to us in a responsible manner.

### Reporting Process

1. **DO NOT** create a public GitHub issue for the vulnerability
2. Report the issue through GitHub Issues with a `[SECURITY]` prefix in the title
3. Or email the maintainer directly (see package.json for contact information)

### What to Include

Please provide the following information:
- Type of vulnerability (e.g., XSS, data exposure, etc.)
- Full paths of source file(s) related to the vulnerability
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability

### What to Expect

- We will try to respond to your report as soon as possible
- As this is an open source project maintained in spare time, response times may vary
- We will work on a fix and release it as soon as we can
- We will credit you for the discovery (unless you prefer to remain anonymous)

## Security Best Practices for Users

1. **Keep the Extension Updated**
   - Always use the latest version of Lara Ver
   - Enable automatic updates in your browser

2. **Browser Security**
   - Keep your browser updated
   - Only install extensions from official stores

3. **Permissions**
   - Review the permissions requested by the extension
   - The extension only requires access to Laravel and Readouble documentation sites

## Scope

The following are within scope for security reports:
- Cross-site scripting (XSS) vulnerabilities
- Data injection vulnerabilities
- Authentication or authorization flaws
- Exposure of sensitive information

The following are **out of scope**:
- Attacks requiring physical access to a user's device
- Social engineering attacks
- Attacks on third-party services or websites

Thank you for helping keep Lara Ver and its users safe!
