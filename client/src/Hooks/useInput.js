import { useState } from "react";

export const useInput = (initialValue, placeholder) => {
    const [value, setValue] = useState(initialValue);

    const onChange = (e) => {
        setValue(e.target.value);
    }

    const rnt = {
        value: value,
        onChange: onChange,
        placeholder: placeholder
    }

    return rnt;
}