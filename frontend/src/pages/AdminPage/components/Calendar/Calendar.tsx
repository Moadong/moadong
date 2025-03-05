import React, { useCallback, useMemo } from "react";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker , {ReactDatePickerCustomHeaderProps} from "react-datepicker";
import * as Styled from "./Calendar.styles";

interface CalendarProps {
    recruitmentStart: Date | null;
    recruitmentEnd: Date | null;
    onChangeStart: (date: Date | null) => void;
    onChangeEnd: (date: Date | null) => void;
}

const CustomHeader = ({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }: ReactDatePickerCustomHeaderProps) => (
    <div className="react-datepicker__header-custom">
        <button
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className="react-datepicker__navigation--custom react-datepicker__navigation--previous--custom"
            onMouseDown={(e) => e.preventDefault()}
        >
            {"<"}
        </button>
        <span className="react-datepicker__current-month">
            {date.getFullYear()}.{(date.getMonth() + 1).toString().padStart(2, "0")}
        </span>
        <button
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className="react-datepicker__navigation--custom react-datepicker__navigation--next--custom"
            onMouseDown={(e) => e.preventDefault()}
        >
            {">"}
        </button>
    </div>
);

const Calendar = ({ recruitmentStart, recruitmentEnd, onChangeStart, onChangeEnd }: CalendarProps) => {

    const selectedStart = useMemo(() => recruitmentStart, [recruitmentStart]);
    const selectedEnd = useMemo(() => recruitmentEnd, [recruitmentEnd]);

    const handleStartChange = useCallback((date: Date | null) => {
        onChangeStart(date);
    }, [onChangeStart]);

    const handleEndChange = useCallback((date: Date | null) => {
        onChangeEnd(date);
    }, [onChangeEnd]);

    return (
        <Styled.DatepickerContainer>
            <DatePicker
                locale={ko}
                selected={selectedStart}
                onChange={handleStartChange}
                selectsStart
                startDate={selectedStart}
                endDate={selectedEnd}
                dateFormat="yyyy.MM.dd"
                maxDate={selectedEnd ?? undefined}
                popperPlacement="bottom-start"
                renderCustomHeader={(props) => <CustomHeader {...props} />}
            />
            <Styled.Tidle>~</Styled.Tidle>
            <DatePicker
                locale={ko}
                selected={selectedEnd}
                onChange={handleEndChange}
                selectsEnd
                startDate={selectedStart}
                endDate={selectedEnd}
                minDate={selectedStart ?? undefined}
                dateFormat="yyyy.MM.dd"
                popperPlacement="bottom-start"
                renderCustomHeader={(props) => <CustomHeader {...props} />}
            />
        </Styled.DatepickerContainer>

    );
};

export default Calendar;
