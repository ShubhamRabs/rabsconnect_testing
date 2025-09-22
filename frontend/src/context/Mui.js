import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import MuiDrawer from "@mui/material/Drawer";
import Fade from "@mui/material/Fade";
import MuiAppBar from "@mui/material/AppBar";
import Collapse from "@mui/material/Collapse";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import OutlinedInput from "@mui/material/OutlinedInput";
import Tab from "@mui/material/Tab";
import Popover from '@mui/material/Popover';
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import MenuItem from "@mui/material/MenuItem";
import Badge from '@mui/material/Badge';
import Backdrop from "@mui/material/Backdrop";
// Mui Icon
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LinearProgress from "@mui/material/LinearProgress";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Chip from "@mui/material/Chip";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import CheckIcon from "@mui/icons-material/Check";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import ImageIcon from "@mui/icons-material/Image";
import PlaceIcon from '@mui/icons-material/Place';
import CircularProgress from "@mui/material/CircularProgress";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CampaignIcon from '@mui/icons-material/Campaign';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import WifiCalling3OutlinedIcon from '@mui/icons-material/WifiCalling3Outlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import NotListedLocationOutlinedIcon from '@mui/icons-material/NotListedLocationOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import CloseIcon from '@mui/icons-material/Close';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import SummarizeIcon from '@mui/icons-material/Summarize';
import PersonIcon from '@mui/icons-material/Person';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import UnpublishedOutlinedIcon from "@mui/icons-material/UnpublishedOutlined";
import IntegrationInstructionsOutlinedIcon from "@mui/icons-material/IntegrationInstructionsOutlined";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReceiptIcon from "@mui/icons-material/Receipt";
import StorefrontIcon from '@mui/icons-material/Storefront';
import SettingsIcon from '@mui/icons-material/Settings';
import Tabs from '@mui/material/Tabs';

import { MuiContext } from "./Context";

const Mui = ({ children }) => {
  return (
    <MuiContext.Provider
      value={{
        Button,
        Skeleton,
        ListItemAvatar,
        Card,
        CardContent,
        LoadingButton,
        Alert,
        Popover,
        CssBaseline,
        Link,
        Paper,
        Box,
        Grid,
        Badge,
        TextField,
        Autocomplete,
        Tooltip,
        Typography,
        createTheme,
        ThemeProvider,
        IconButton,
        Input,
        Tabs,
        InputLabel,
        InputAdornment,
        Checkbox,
        FormControl,
        RadioGroup,
        Radio,
        FormControlLabel,
        Select,
        Visibility,
        VisibilityOff,
        ListItem,
        styled,
        MuiDrawer,
        MuiAppBar,
        Collapse,
        Avatar,
        Chip,
        Toolbar,
        Divider,
        List,
        ListItemButton,
        ListItemIcon,
        ListItemText,
        Timeline,
        Backdrop,
        timelineItemClasses,
        TimelineItem,
        TimelineSeparator,
        TimelineConnector,
        TimelineContent,
        TimelineDot,
        OutlinedInput,
        MenuItem,
        Tab,
        TabPanel,
        TabList,
        TabContext,
        Fade,
        MenuIcon,
        InboxIcon,
        CampaignIcon,
        MailIcon,
        FingerprintIcon,
        SettingsIcon,
        NotificationsOutlinedIcon,
        AccountCircleOutlinedIcon,
        LogoutIcon,
        DashboardIcon,
        SwitchAccountIcon,
        ManageAccountsIcon,
        AccountTreeIcon,
        DisplaySettingsIcon,
        KeyboardArrowDownIcon,
        CheckBoxOutlineBlankIcon,
        ChevronLeftIcon,
        TaskAltIcon,
        CancelIcon,
        CheckBoxIcon,
        AutoFixHighIcon,
        EditIcon,
        PreviewIcon,
        VisibilityIcon,
        LocalPhoneIcon,
        WhatsAppIcon,
        MarkunreadIcon,
        FilterAltIcon,
        FilterAltOffIcon,
        DeleteOutlineRoundedIcon,
        ReportProblemOutlinedIcon,
        SwapVertIcon,
        CheckIcon,
        NotInterestedIcon,
        VisibilityOutlinedIcon,
        AccountBoxOutlinedIcon,
        AddIcon,
        ArrowBackIosIcon,
        SendOutlinedIcon,
        ImageIcon,
        FileDownloadOutlinedIcon,
        FileUploadOutlinedIcon,
        AssignmentIndOutlinedIcon,
        LinearProgress,
        EmailOutlinedIcon,
        CallOutlinedIcon,
        CircularProgress,
        CloudDownloadIcon,
        MoreVertOutlinedIcon,
        AssessmentIcon,
        WifiCalling3OutlinedIcon,
        FilterListIcon,
        PictureAsPdfIcon,
        ManageAccountsOutlinedIcon,
        RestartAltOutlinedIcon,
        AccessTimeOutlinedIcon,
        NotListedLocationOutlinedIcon,
        CloseIcon,
        AnalyticsOutlinedIcon,
        BusinessOutlinedIcon,
        CreditScoreIcon,
        PersonIcon,
        SummarizeIcon,
        DomainVerificationIcon,
        ArticleOutlinedIcon,
        PaidOutlinedIcon,
        PlaceIcon,
        UnpublishedOutlinedIcon,
        IntegrationInstructionsOutlinedIcon,
        Diversity3Icon,
        CardGiftcardIcon,
        ArrowForwardIcon,
        StorefrontIcon,
        ReceiptIcon,
      }}
    >
      {children}
    </MuiContext.Provider>
  );
};

export default Mui;
