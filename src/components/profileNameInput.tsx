import { validateProfilename } from "@/utils/validate";
import { FormControl, TextInput } from "@primer/react";
import { useEffect } from "react";
import { checkProfileExits } from "../../app/profile/checkProfileExits";

export default function ProfilenameInput({
  value: inputProfilename,
  setValue: setInputProfilename,
  validateMessage,
  setValidateMessage,
  ignoredId,
}: {
  value: string | undefined;
  setValue: (s: string | undefined) => void;
  validateMessage: string | boolean | undefined;
  setValidateMessage: (s: string | boolean | undefined) => void;
  ignoredId?: string[];
}) {
  useEffect(() => {
    let ignore = false;
    if (validateMessage === false)
      checkProfileExits(inputProfilename!).then((v) => {
        if (ignore) return;
        const d = v && !ignoredId?.includes(v.id);
        setValidateMessage(d ? "已被注册" : true);
      });
    return () => void (ignore = true);
  });
  return (
    <FormControl>
      <FormControl.Label>角色名</FormControl.Label>
      <TextInput
        block
        value={inputProfilename || ""}
        onChange={(e) => {
          setInputProfilename(e.target.value);
          if (typeof validateMessage === "boolean")
            setValidateMessage(undefined);
          if (typeof validateMessage === "string")
            setValidateMessage(validateProfilename(e.target.value));
        }}
        onBlur={(e) =>
          setValidateMessage(validateProfilename(e.target.value) || false)
        }
        loading={validateMessage === false}
        aria-invalid={typeof validateMessage === "string"}
      />
      {validateMessage === true ? (
        <FormControl.Validation variant="success">
          未被占用
        </FormControl.Validation>
      ) : (
        validateMessage && (
          <FormControl.Validation variant="error">
            {validateMessage}
          </FormControl.Validation>
        )
      )}
      <FormControl.Caption>
        由数字、字母、下划线构成，不得以数字开头，长度在 3 到 16 之间
      </FormControl.Caption>
    </FormControl>
  );
}
