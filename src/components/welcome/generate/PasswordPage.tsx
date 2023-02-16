import { Input, Spacer, Text, useInput } from "@arconnect/components";
import PasswordStrength from "../PasswordStrength";
import Paragraph from "~components/Paragraph";
import browser from "webextension-polyfill";

export default function PasswordPage({
  passwordInput,
  validPasswordInput
}: Props) {
  return (
    <>
      <Text heading>{browser.i18n.getMessage("create_password")}</Text>
      <Paragraph>
        {browser.i18n.getMessage("create_password_paragraph")}
      </Paragraph>
      <Input
        type="password"
        {...passwordInput.bindings}
        placeholder={browser.i18n.getMessage("enter_password")}
        fullWidth
      />
      <Spacer y={1} />
      <Input
        type="password"
        {...validPasswordInput.bindings}
        placeholder={browser.i18n.getMessage("enter_password_again")}
        fullWidth
      />
      <Spacer y={1.55} />
      <PasswordStrength password={passwordInput.state} />
      <Spacer y={1} />
    </>
  );
}

interface Props {
  passwordInput: ReturnType<typeof useInput>;
  validPasswordInput: ReturnType<typeof useInput>;
}
