import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import * as Yup from "yup";

dayjs.extend(customParseFormat);

export const UserAttendanceSchema = Yup.object().shape({
    user: Yup.array()
        .min(1, "Please select at least one User")
        .required("User is required"),
    start_date: Yup.date().required("Date from is required"),
    end_date: Yup.string().when('start_date', (start_date, schema) => {
        return start_date && schema.test('Date To', 'Date To must be greater than Date From', function (value) {
            return !dayjs(value).isBefore(start_date);
        }).required('Date To is required');
    }),
});

export const AddEditAttendanceSchema = Yup.object().shape({
    login_time: Yup.string()
        .test(
            'not empty',
            'Login time cannot be empty',
            function (value) {
                return !!value;
            }
        )
        .test(
            "before_logout_time",
            "Login time must be before logout time",
            function (value) {
                const logoutTime = this.parent.logout_time;
                const parsedLoginTime = dayjs(value, "HH:mm").format("HH:mm");
                const parsedLogoutTime = dayjs(logoutTime, "HH:mm").format("HH:mm");
                // Check if login_time is before logout_time
                return dayjs(parsedLoginTime, "HH:mm").isBefore(dayjs(parsedLogoutTime, "HH:mm"), "minute");
            }
        ),
    logout_time: Yup.string()
        .test(
            'not empty',
            'Logout time cannot be empty',
            function (value) {
                return !!value;
            }
        )
});