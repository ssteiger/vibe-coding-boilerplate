/** @jsxImportSource react */
import { CodeEmail } from './components/CodeEmail'
import { APP_NAME } from './components/EmailLayout'

/** Sent when an existing user signs in. */
export const MagicLink = () => (
  <CodeEmail
    preview={`Your sign-in code for ${APP_NAME}`}
    title="Sign in"
    intro={`Enter this code in ${APP_NAME} to sign in, or use the button below.`}
    buttonLabel="Sign in"
    ignoreNote="If you did not try to sign in, you can ignore this email. Nobody can sign in without the code."
  />
)
