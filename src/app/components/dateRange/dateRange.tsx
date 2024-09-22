import React, { Dispatch, SetStateAction, useState } from "react";
import { Tooltip } from "@mui/material";
import { Dayjs } from "dayjs";
import { Display } from "./styles";
import DataPicker from "../datePicker/datePicker";

interface IDisplayProps {
    initialDate: Dayjs | null | undefined;
    endDate?: Dayjs | null | undefined;
    setInitialDate: Dispatch<SetStateAction<Dayjs | null | undefined>>;
    setFinalDate: Dispatch<SetStateAction<Dayjs | null | undefined>>;
    typeOfDatePicker: string;
}

export default function DateRangeDisplay(props: Readonly<IDisplayProps>) {
  const { initialDate, setFinalDate, setInitialDate, typeOfDatePicker, endDate } = props;
  const [datePickerState, setdatePickerState] = useState<boolean>(false);
  return (
    <>
      <Tooltip
        onClick={() => setdatePickerState(true)}
        title="Alterar data"
        followCursor
      >
        <Display>
          Período: {initialDate?.format("DD/MM/YYYY")}
          {endDate ? ` - ${endDate?.format("DD/MM/YYYY")}` : ""}
        </Display>
      </Tooltip>
      <DataPicker
        typeOfDatePicker={typeOfDatePicker}
        title="Filtrar data"
        isOpen={datePickerState}
        onOpen={() => setdatePickerState(true)}
        onClose={() => setdatePickerState(false)}
        initialDate={initialDate}
        endDate={endDate}
        setFinalDate={setFinalDate}
        setInitialDate={setInitialDate}
      />
    </>
  );
}
