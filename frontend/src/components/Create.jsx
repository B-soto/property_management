// #TODO - for each rental proejct, include 
// current tenants, legal docs, past applicants, each complaint / note section
// payment portal per house, 


import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MyDatePickerField from "./forms/MyDatePickerField";
import MyTextField from "./forms/MyTextField";
import MySelectField from "./forms/MySelectField";
import MyMultilineField from "./forms/MyMultiLineField";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import AxiosInstance from "./Axios";
import Dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { React, useState, useEffect } from "react";

const Create = () => {
  const [projectmanager, setProjectManager] = useState();
  const [loading, setLoading] = useState(true);

  const hardcoded_options = [
    { id: "", name: "None" },
    { id: "Open", name: "Open" },
    { id: "In Progress", name: "In Progress" },
    { id: "Completed", name: "Completed" },
  ];

  const GetData = () => {
    AxiosInstance.get(`projectmanager/`).then((res) => {
      setProjectManager(res.data);
      console.log(res.data);
      setLoading(false);
    });
  };
  // Use Effect here will call axios to get the data and log it to the page
  // empty arr so that it is only called once
  useEffect(() => {
    GetData();
  }, []);

  const nav = useNavigate();
  const defaultValues = {
    name: "",
    comments: "",
    status: "",
  };

  const schema = yup.object({
    name: yup.string().required("Name is a required field"),
    projectmanager: yup.string().required("projectmanager is a required field"),
    status: yup.string().required("Status is a required field"),
    comments: yup.string(),
    start_date: yup.date().required("Start date is a required field"),
    end_date: yup
      .date()
      .required("End date is a required field")
      .min(yup.ref("start_date"), "End date must be after start date"),
  });

  const { handleSubmit, control } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const submission = (data) => {
    const StartDate = Dayjs(data.start_date["$d"]).format("YYYY-MM-DD"); // Formatting so our DB can take it in
    const EndDate = Dayjs(data.end_date["$d"]).format("YYYY-MM-DD");

    AxiosInstance.post(`project/`, {
      // axios is the connector between ract / django
      name: data.name,
      projectmanager: data.projectmanager,
      status: data.status,
      comments: data.comments,
      start_date: StartDate,
      end_date: EndDate,
    })

      // then will specificy why action to do next. We can flash successs or redirect to new page. In this case, home page
      .then((res) => {
        nav(`/`);
      });
  };

  return (
    <div>
      {loading ? (
        <p> Loading data...</p>
      ) : (
        <form onSubmit={handleSubmit(submission)}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              backgroundColor: "#0003",
              marginBottom: "10px",
            }}
          >
            <Typography sx={{ marginLeft: "20px", color: "#fff" }}>
              Create records
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              width: "100%",
              boxShadow: 3,
              padding: 4,
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                marginBottom: "30px",
              }}
            >
              <MyTextField
                label="Name"
                name="name"
                control={control}
                placeholder="Prove project name"
                width={"30%"}
              />

              <MyDatePickerField
                label="Start Date"
                name="start_date"
                control={control}
                width={"30%"}
              />

              <MyDatePickerField
                label="End Date"
                name="end_date"
                control={control} 
                width={"30%"}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
              <MyMultilineField
                label="Comments"
                name="comments"
                control={control}
                placeholder="Provide comments"
                width={"30%"}
              />

              <MySelectField
                options={hardcoded_options}
                label="status"
                name="status"
                control={control}
                width={"30%"}
              />

              <MySelectField
                label="Project manager"
                name="projectmanager"
                control={control}
                width={"30%"}
                options={projectmanager}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                marginTop: "40px",
              }}
            >
              <Button variant="contained" type="submit" sx={{ width: "30%" }}>
                Submit
              </Button>
            </Box>
          </Box>
        </form>
      )}
    </div>
  );
};

export default Create;
