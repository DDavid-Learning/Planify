import dayjs, { Dayjs } from "dayjs";
import DefaultModal, { IModalProps } from "../defaultModal/defaultModal";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Container, SecondContainer, StyledDivCalendar, StyledDivPrimaryCalendar, StyledDivTextCalendar } from "./styles";
import { DateCalendar, DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button } from "@mui/material";


interface IDataPicker extends IModalProps {
    initialDate?: Dayjs | null | undefined;
    endDate?: Dayjs | null | undefined;
    setInitialDate: Dispatch<SetStateAction<Dayjs | null | undefined>> | ((date: Dayjs | null) => void); // Parentheses added here
    setFinalDate?: Dispatch<SetStateAction<Dayjs | null | undefined>>;
    typeOfDatePicker: string;
  }
  
  type TDataPicker = Omit<IDataPicker, "children">;
  
  export default function DataPicker(props: Readonly<TDataPicker>) {
    const { isOpen, onClose, onOpen, title, typeOfDatePicker } = props;
  
    return (
      <DefaultModal
        title={title}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      >
        <DatePickerModal {...props} typeOfDatePicker={typeOfDatePicker} />
      </DefaultModal>
    );
  }
  
  const DatePickerModal = (props: Readonly<TDataPicker>) => {
    const { initialDate: propInitialDate, setInitialDate, onClose, typeOfDatePicker } = props;
  
    const [initialDate, setLocalInitialDate] = useState<Dayjs | null | undefined>(propInitialDate);
  
    useEffect(() => {
      if (typeOfDatePicker === "mes" && !initialDate) {
        setLocalInitialDate(dayjs().startOf("month"));
      }
    }, [typeOfDatePicker, initialDate]);
  
    const handleEnviarClick = () => {
        if (initialDate) {
            setInitialDate(initialDate);
        }
      onClose();
    };
  
  
    return (
      <Container>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="pt-br"
        >
          <SecondContainer>
            <StyledDivPrimaryCalendar>
              <StyledDivTextCalendar>
                <DateField
                  size={"small"}
                  variant={"standard"}
                  label="Data Inicial"
                  value={initialDate}
                  format="DD/MM/YYYY"
                  onChange={(value) => setLocalInitialDate(value)}
                />
              </StyledDivTextCalendar>
              <StyledDivCalendar>
                <DateCalendar
                  value={initialDate}
                  onChange={(value) => setLocalInitialDate(value)}
                />
              </StyledDivCalendar>
            </StyledDivPrimaryCalendar>
          </SecondContainer>
          <Button
            sx={{ width: "10svw", marginTop: "30px" }}
            component="label"
            variant="contained"
            onClick={handleEnviarClick}
          >
            Enviar
          </Button>
        </LocalizationProvider>
      </Container>
    );
  };