// Importing necessary dependencies and components from React and other files
import React from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui } from "../../../hooks/Hooks";
import { Formik, Form } from "formik";
import UserImg from "../../../assets/Image/user.png";
import "./Profile.css";
import {
  CustomFormGroup,
  CustomInputField,
  CustomMobileFiled,
  CustomSelectField,
} from "../../../components/FormUtility/FormUtility";
import { Ccode } from "../../../data/LeadData";
import { ProfileSchema } from "../../../schema/Other/OtherSchema";
import {
  GetUserDetails,
  useUpdateProfileDetails,
} from "../../../hooks/Other/UseProfileHook";
import { useQuery } from "react-query";
import Cookies from "js-cookie";
import { CustomModal } from "../../../components/CustomModal/CustomModal";
import { Religion } from "../../../data/Profile";

// React functional component named Profile
const Profile = ({ myglobalData }) => {
  // Destructuring utility functions and components from custom hooks and libraries
  const { Card, Row } = useBootstrap();
  const {
    Avatar,
    IconButton,
    EditIcon,
    Divider,
    LoadingButton,
    Alert,
    Skeleton,
  } = useMui();

  // State variables for managing image, success message, and form field values
  const [imageExists, setImageExists] = React.useState(true);
  const [image, setImage] = React.useState("");
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  const [crop, setCrop] = React.useState({
    width: 25,
    height: 25,
    maxWidth: 25,
    maxHeight: 25,
  });
  const [initialValues, setinitialValues] = React.useState({
    fname: "",
    mname: "",
    lname: "",
    r_email: "",
    p_email: "",
    initialize: false,
  });
  const [isImageSelected, setIsImageSelected] = React.useState(false);
  const [showImage, setShowImage] = React.useState(true);
  const [prevImage, setPrevImage] = React.useState(null);
  const [previousImage, setPreviousImage] = React.useState(null);
  const fileInputRef = React.useRef();
  const previewCanvasRef = React.useRef(null);
  const imgRef = React.useRef(null);

  // Define a constant to check user role
  const isEditable =
    Cookies.get("role") === "Master" ||
    Cookies.get("role") === "Admin" ||
    Cookies.get("role") === "HR Head" ||
    Cookies.get("role") === "HR";

  // Check if the image exists when the component mounts
  React.useEffect(() => {
    const checkImageExists = async () => {
      const img = new Image();
      img.onload = () => {
        setImageExists(true);
      }; // Image loaded successfully
      img.onerror = () => setImageExists(false); // Image failed to load
      img.src = image;
    };

    checkImageExists();
  }, [image]);

  const UserDetails = useQuery(
    "UserDetails",
    () => {
      return GetUserDetails();
    },
    {
      onSuccess: (data) => {
        if (data.data.length !== 0 && initialValues.initialize === false) {
          setinitialValues({
            aadhar_no: data.data[0].aadhar_no,
            ac_name: data.data[0].ac_name,
            account_no: data.data[0].account_no,
            bank_branch: data.data[0].bank_branch,
            bank_name: data.data[0].bank_name,
            dob: data.data[0].dob,
            fname: data.data[0].fname,
            gender: data.data[0].gender,
            health: data.data[0].health,
            health_issue: data.data[0].health_issue,
            ifsc_code: data.data[0].ifsc_code,
            lname: data.data[0].lname,
            location: data.data[0].location,
            mname: data.data[0].mname,
            mstatus: data.data[0].mstatus,
            join_date: data.data[0].join_date,
            p_ccode: data.data[0].p_ccode,
            p_email: data.data[0].p_email,
            p_mob: data.data[0].p_mob || "",
            pan_no: data.data[0].pan_no,
            pf_no: data.data[0].pf_no,
            profile_image: data.data[0].profile_image,
            r_email: data.data[0].r_email,
            religion: data.data[0].religion,
            u_id: data.data[0].u_id,
            initialize: true,
          });
          setImage(
            `${myglobalData.API_URL}/uploads/profile/${Cookies.get("u_id")}/${
              data.data[0].profile_image
            }`
          );
        }
      },
      refetchOnWindowFocus: false,
      enabled: true,
    }
  );

  console.log(UserDetails.data, "UserDetails");

  // Mutation hook for updating profile details
  const { mutate, isLoading } = useUpdateProfileDetails();

  // Submit handler for updating profile details
  const HandleSubmit = (values) => {
    let data = [values, image, { isImageSelected }];
    console.log(data, "Data for profile update");
    // console.log(data);
    mutate(data, {
      onSuccess: (data) => {
        console.log(data, "data");
        setShowSuccessMessage(data.data);
        UserDetails.refetch();
        setinitialValues((prevState) => ({
          ...prevState,
          initialize: false,
        }));
        setTimeout(() => {
          setShowSuccessMessage(null);
        }, 3000);
        if (isImageSelected) {
          window.location.reload(true);
        }
        setIsImageSelected(false);
      },
    });
  };

  // Handler for changing the profile image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setPreviousImage(image);
        setImage(e.target.result);
        setPrevImage(e.target.result);
        setIsImageSelected(true);
        setShowModal(true);
        setShowImage(true);
      };

      reader.readAsDataURL(file);
    }
  };

  // const onCropChange = (crop, percentCrop) => {
  //   setCrop(crop);
  // };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    // const cropWidthInPercent = (100 / width) * 100;
    // const cropHeightInPercent = (100 / height) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: 25,
        height: 25,
      },
      // ASPECT_RATIO,
      1,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const setCanvasPreview = (
    image, // HTMLImageElement
    canvas, // HTMLCanvasElement
    crop // PixelCrop
  ) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }
      
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";
    ctx.save();

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    // Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    ctx.restore();
  };

  const handleCropImage = () => {
    setShowModal(false);
    setCanvasPreview(
      imgRef.current, // HTMLImageElement
      previewCanvasRef.current, // HTMLCanvasElement
      convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
    );
    const dataUrl = previewCanvasRef.current.toDataURL();
    setImage(dataUrl);
  };

  // Form component for profile details
  const ProfileForm = () => {
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={ProfileSchema}
        onSubmit={HandleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Row>
              {/* Custom form group for First Name */}
              <CustomFormGroup
                formlabel="First Name"
                star="*"
                FormField={
                  <CustomInputField
                    type="text"
                    name="fname"
                    placeholder="Enter First Name..."
                  />
                }
              />
              {/* Custom form group for Middle Name */}
              <CustomFormGroup
                formlabel="Middle Name"
                // star="*"
                FormField={
                  <CustomInputField
                    type="text"
                    name="mname"
                    placeholder="Enter Middle Name..."
                  />
                }
              />
              {/* Custom form group for Last Name */}
              <CustomFormGroup
                formlabel="Last Name"
                star="*"
                FormField={
                  <CustomInputField
                    type="text"
                    name="lname"
                    placeholder="Enter Last Name..."
                  />
                }
              />
              {/* Custom mobile field for Mobile Number */}
              {/* <CustomMobileFiled
                formlabel="Mobile No."
                type="text"
                placeholder="Mobile No."
                onChange={(value, data) => {
                  setFieldValue("p_mob", value.slice(data.dialCode.length));
                  setFieldValue("p_ccode", data.dialCode);
                }}
                defaultVal={values.p_ccode + " " + values.p_mob}
                options={Ccode}
                defaultvalue={Ccode[0]}
              /> */}
              {/* Custom form group for Company Email */}
              <CustomFormGroup
                formlabel="Company Email"
                // star="*"
                FormField={
                  <CustomInputField
                    type="text"
                    name="r_email"
                    placeholder="william@example.com"
                  />
                }
              />
              {/* Custom form group for Personal Email */}
              <CustomFormGroup
                formlabel="Personal Email"
                // star="*"
                FormField={
                  <CustomInputField
                    type="text"
                    name="p_email"
                    placeholder="example@gmail.com"
                  />
                }
              />
              <CustomFormGroup
                formlabel="D.O.B."
                star="*"
                FormField={
                  <CustomInputField type="date" name="dob" value={values.dob} />
                }
              />
              <CustomFormGroup
                formlabel="Health Issues"
                star="*"
                FormField={
                  <CustomSelectField
                    name="health"
                    initialValue={{
                      label: initialValues.health,
                      value: initialValues.health,
                    }}
                    FieldValue={setFieldValue}
                    isLabelValue={true}
                    placeholder="Health Issues"
                    options={[
                      { value: "Yes", label: "Yes" },
                      { value: "No", label: "No" },
                    ]}
                  />
                }
              />
              {values.health === "Yes" && (
                <CustomFormGroup
                  formlabel="Enter your Health Issues"
                  star="*"
                  FormField={
                    <CustomInputField
                      name="health_issue"
                      FieldValue={setFieldValue}
                      placeholder="Health Issues"
                    />
                  }
                />
              )}
              <CustomFormGroup
                formlabel="Religion"
                star="*"
                FormField={
                  <CustomSelectField
                    type="text"
                    name="religion"
                    initialValue={{
                      label: initialValues.religion,
                      value: initialValues.religion,
                    }}
                    FieldValue={setFieldValue}
                    isLabelValue={true}
                    placeholder="Enter Religion"
                    options={Religion}
                  />
                }
              />
              <CustomFormGroup
                formlabel="Gender"
                star="*"
                FormField={
                  <CustomSelectField
                    type="text"
                    name="gender"
                    initialValue={{
                      label: initialValues.gender,
                      value: initialValues.gender,
                    }}
                    FieldValue={setFieldValue}
                    isLabelValue={true}
                    placeholder="Enter Gender"
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                    ]}
                  />
                }
              />
              <CustomFormGroup
                formlabel="Marital Status"
                star="*"
                FormField={
                  <CustomSelectField
                    type="text"
                    name="mstatus"
                    initialValue={{
                      label: initialValues.mstatus,
                      value: initialValues.mstatus,
                    }}
                    FieldValue={setFieldValue}
                    isLabelValue={true}
                    placeholder="Enter Marital Status"
                    options={[
                      { value: "Married", label: "Married" },
                      { value: "Unmarried", label: "Unmarried" },
                    ]}
                  />
                }
              />
              <CustomFormGroup
                formlabel="Joining Date"
                star="*"
                FormField={
                  <CustomInputField
                    type="date"
                    name="join_date"
                    value={values.join_date}
                  />
                }
              />
              <CustomFormGroup
                formlabel="Pan No "
                star="*"
                FormField={
                  <CustomInputField
                    type="text"
                    name="pan_no"
                    placeholder="Enter Your PF Pan Number"
                  />
                }
              />
              <CustomFormGroup
                formlabel="Pf No "
                star="*"
                FormField={
                  <CustomInputField
                    type="text"
                    name="pf_no"
                    placeholder="Enter Your PF Number"
                    disabled={!isEditable}
                  />
                }
              />
              <CustomFormGroup
                formlabel="Aadhaar No"
                star="*"
                FormField={
                  <CustomInputField
                    type="text"
                    name="aadhar_no"
                    placeholder="Enter Your Aadhaar Number"
                  />
                }
              />
              {/* <CustomFormGroup
                formlabel="Basic Salary"
                star="*"
                FormField={
                  <CustomInputField
                    type="text"
                    name="basic_salary"
                    placeholder="Enter Your Basic Salary"
                    disabled={!isEditable}
                  />
                }
              />
              <CustomFormGroup
                formlabel="Designation"
                star="*"
                FormField={
                  <CustomInputField
                    type="text"
                    name="designation"
                    placeholder="Enter Your Designation"
                    disabled={!isEditable}
                  />
                }
              />
              <CustomFormGroup
                formlabel="Department"
                star="*"
                FormField={
                  <CustomInputField
                    type="text"
                    name="department"
                    placeholder="Enter Your Department"
                    disabled={!isEditable}
                  />
                }
              /> */}
              <CustomFormGroup
                formlabel="Location"
                star="*"
                FormField={
                  <CustomInputField
                    type="text"
                    name="location"
                    placeholder="Enter Location"
                  />
                }
              />
              <CustomFormGroup
                formlabel="Bank Name"
                star="*"
                FormField={
                  <CustomInputField
                    type="text"
                    name="bank_name"
                    placeholder="Enter Bank Name"
                  />
                }
              />
            </Row>
            <Row>
              <CustomFormGroup
                formlabel="Branch Name"
                star="*"
                FormField={
                  <CustomInputField
                    type="text"
                    name="bank_branch"
                    placeholder="Enter Branch Name"
                  />
                }
              />
              <CustomFormGroup
                formlabel="IFSC Code"
                star="*"
                FormField={
                  <CustomInputField
                    type="text"
                    name="ifsc_code"
                    placeholder="Enter IFSC Code"
                  />
                }
              />
              <CustomFormGroup
                formlabel="Account Name"
                star="*"
                FormField={
                  <CustomInputField
                    type="text"
                    name="ac_name"
                    placeholder="Enter Account Name"
                  />
                }
              />
              <CustomFormGroup
                formlabel="Account Number"
                star="*"
                FormField={
                  <CustomInputField
                    type="text"
                    name="account_no"
                    placeholder="Enter Account Number"
                  />
                }
              />
            </Row>
            <Divider sx={{ my: 2 }} />
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading}
            >
              Update Profile
            </LoadingButton>
          </Form>
        )}
      </Formik>
    );
  };

  // Render component with user profile information
  return (
    <>
      {/* Breadcrumb component for page navigation */}
      <Breadcrumb PageName="Profile" />
      {/* Card component for organizing content */}
      <Card className="mt-3">
        <Card.Body>
          {/* Profile header section */}
          <div className="profile-head"></div>
          <div className="d-flex align-items-center mb-5">
            {/* Profile image container with avatar, input, and edit icon */}
            <div className="profile-img-container">
              <Avatar
                alt="Profile Picture"
                src={imageExists === false ? UserImg : image}
                sx={{ width: "100%", height: "100%" }}
              />
              <input
                type="file"
                name="profile_img"
                className="edit-profile-img-input"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
              />
              <IconButton
                aria-label="delete"
                size="small"
                className="edit-profile-img-icon"
                onClick={() => {
                  setShowModal(true);
                  if (isImageSelected) {
                    setShowImage(false);
                  }
                  fileInputRef.current.click();
                }}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
            </div>
            {/* Profile information section */}
            <div className="profile-info">
              <h3>
                {Cookies.get("username")} &nbsp; ({Cookies.get("role")})
              </h3>
              <span>Update Your Photo and Personal Details.</span>
            </div>
          </div>
          {/* Display success message if available */}
          {showSuccessMessage && (
            <Alert severity="info" className="my-3">
              {showSuccessMessage}
            </Alert>
          )}
          {/* Render profile form or skeleton loader while data is loading */}
          {!UserDetails.isLoading ? (
            <ProfileForm />
          ) : (
            <Skeleton
              width="100%"
              height={200}
              variant="rectangular"
              animation="wave"
            />
          )}
        </Card.Body>
      </Card>
      <CustomModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          if (previousImage !== null) {
            setImage(previousImage);
          }
        }}
        showHeader={true}
        ModalTitle="Crop Your Image"
        hideCloseIcon={true}
        nobackdrop={true}
        ModalBody={
          prevImage === null ? (
            <p>Please select an image</p>
          ) : (
            <div className="image-popup mw-100">
              <ReactCrop
                crop={crop}
                onImageLoaded={setImage}
                circularCrop
                onChange={(pixelCrop, percentCrop) => setCrop(pixelCrop)}
                aspect={1}
                className="w-100"
                imageStyle={{ maxWidth: "100%", width: "100%" }}
              >
                <img
                  src={showImage ? image : prevImage}
                  ref={imgRef}
                  alt="profileimage"
                  style={{ maxHeight: "70vh" }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
              <div className="w-100 d-flex justify-content-center">
                <LoadingButton onClick={handleCropImage} className="mt-3">
                  Crop Image
                </LoadingButton>
              </div>
            </div>
          )
        }
      />
      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: 150,
            height: 150,
          }}
        />
      )}
    </>
  );
};

// Exporting the Profile component as the default export
export default Profile;
