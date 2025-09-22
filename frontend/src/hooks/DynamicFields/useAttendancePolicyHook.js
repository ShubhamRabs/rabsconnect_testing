import dayjs from "dayjs";

import { createMutationHook, makeApiRequest } from "../../Handler/HooksHandler";


export const GetAllAttendancePolicy = (fields) =>
    makeApiRequest(`/attendance-policy/get-all-attendance-policy`, { columns: fields });

export const SetEditAttendancePolicy = (data) =>{
    const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    return makeApiRequest(`/attendance-policy/edit-attendance-policy`, { data, DateTime });
}

export const GetCalendarApi = async (data) => {
    try {
        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/en.indian%23holiday%40group.v.calendar.google.com/events?orderBy=startTime&singleEvents=true&timeMin=2024-01-01T00%3A00%3A00Z&timeMax=2024-12-31T23%3A59%3A59Z&fields=items(description%2Cstart%2Cend%2Csummary)&key=${process.env.REACT_APP_GOOGLE_API}`);
        const data = await response.json();
        return data;
    } catch (err) {
        return err;
    }
}

export const useEditAttendancePolicy = createMutationHook(SetEditAttendancePolicy);
