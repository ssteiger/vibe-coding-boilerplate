/** @jsxImportSource react */
import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import type { ReactNode } from 'react'

import { styles } from '../styles'

export const APP_NAME = 'Boilerplate'

type EmailLayoutProps = {
  locale: 'de' | 'en'
  preview: string
  children: ReactNode
}

export const EmailLayout = ({ locale, preview, children }: EmailLayoutProps) => (
  <Html lang={locale}>
    <Head>
      <meta name="color-scheme" content="light" />
      <meta name="supported-color-schemes" content="light" />
    </Head>
    <Preview>{preview}</Preview>

    <Body style={styles.main}>
      <Container style={styles.container}>
        <Section style={styles.header}>
          <Text style={styles.wordmark}>{APP_NAME}</Text>
        </Section>

        <Section style={styles.card}>
          <Row>
            <Column style={styles.cardBody}>{children}</Column>
          </Row>
        </Section>

        <Text style={styles.footer}>
          © {new Date().getFullYear()} {APP_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
)
