import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Accordion from "react-bootstrap/Accordion";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Spinner from 'react-bootstrap/Spinner';
import { BootstrapContext } from "./Context";

const Bootstrap = ({ children }) => {
  return (
    <BootstrapContext.Provider
      value={{
        Container,
        Row,
        Col,
        Dropdown,
        DropdownButton,
        Modal,
        Card,
        Alert,
        Form,
        Accordion,
        Tab,
        Tabs,
        Spinner
      }}
    >
      {children}
    </BootstrapContext.Provider>
  );
};

export default Bootstrap;
