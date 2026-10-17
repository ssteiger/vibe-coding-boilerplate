/** @jsxImportSource react */
import { CodeEmail } from './components/CodeEmail'
import { APP_NAME } from './components/EmailLayout'

/** Sent when someone signs up, to confirm their email address. */
export const Confirmation = () => (
  <CodeEmail
    preview={`Confirm your email for ${APP_NAME}`}
    title="Confirm your email"
    intro={`Welcome to ${APP_NAME}. Enter this code to confirm your email and finish creating your account, or use the button below.`}
    buttonLabel="Confirm email"
    ignoreNote="If you did not create an account, you can ignore this email. No account is created without the code."
  />
)
