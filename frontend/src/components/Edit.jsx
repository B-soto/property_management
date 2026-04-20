import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { React, useEffect, useState } from "react";
import MyDatePickerField from "./forms/MyDatePickerField";
import MyTextField from "./forms/MyTextField";
import MySelectField from "./forms/MySelectField";
import MyMultilineField from "./forms/MyMultiLineField";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import AxiosInstance from "./Axios";
import Dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Edit = () => {
  const MyParam = useParams();
  const MyId = MyParam.id;

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
    });

    AxiosInstance.get(`project/${MyId}`).then((res) => {
      console.log(res.data);
      setValue("name", res.data.name);
      setValue("status", res.data.status);
      setValue("projectmanager", res.data.projectmanager);
      setValue("comments", res.data.comments);
      setValue("start_date", Dayjs(res.data.start_date));
      setValue("end_date", Dayjs(res.data.end_date));
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
    start_date: null, // Add this
    end_date: null, // Add this
  };

  const { handleSubmit, setValue, control } = useForm({
    defaultValues: defaultValues,
  });
  const submission = (data) => {
    const StartDate = Dayjs(data.start_date["$d"]).format("YYYY-MM-DD"); // Formatting so our DB can take it in
    const EndDate = Dayjs(data.end_date["$d"]).format("YYYY-MM-DD");

    AxiosInstance.put(`project/${MyId}/`, {
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
                label="status"
                name="status"
                control={control}
                width={"30%"}
                options={hardcoded_options}
              />

              <MySelectField
                label="Project Manager"
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

export default Edit;
