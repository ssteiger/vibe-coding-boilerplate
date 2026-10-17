/** @jsxImportSource react */
import { Button, Hr, Link, Section, Text } from '@react-email/components'

import { styles } from '../styles'
import { EmailLayout } from './EmailLayout'

/*
 * Supabase fills in the Go template placeholders when it sends the email, so
 * they pass through React Email as plain strings.
 */
const CONFIRMATION_URL = '{{ .ConfirmationURL }}'
const TOKEN = '{{ .Token }}'

type CodeEmailProps = {
  preview: string
  title: string
  intro: string
  buttonLabel: string
  ignoreNote: string
}

/** A one-time code to type into the app, with a button that does the same in one click. */
export const CodeEmail = ({ preview, title, intro, buttonLabel, ignoreNote }: CodeEmailProps) => (
  <EmailLayout locale="en" preview={preview}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.paragraph}>{intro}</Text>
    <Text style={styles.code}>{TOKEN}</Text>

    <Section style={styles.buttonSection}>
      <Button href={CONFIRMATION_URL} style={styles.button}>
        {buttonLabel}
      </Button>
    </Section>
    <Text style={styles.note}>The code and the button work once, for the next hour.</Text>

    <Hr style={styles.hr} />

    <Text style={styles.small}>
      If the button does not work, paste this link into your browser:{' '}
      <Link href={CONFIRMATION_URL} style={styles.anchor}>
        {CONFIRMATION_URL}
      </Link>
    </Text>
    <Text style={styles.small}>{ignoreNote}</Text>
  </EmailLayout>
)
