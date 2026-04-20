import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { React, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import AxiosInstance from "./Axios";
import { useNavigate, useParams } from "react-router-dom";

const Edit = () => {
  const MyParam = useParams();
  const MyId = MyParam.id;

  const [myData, setMyData] = useState();
  const [loading, setLoading] = useState(true);

  const GetData = () => {
    AxiosInstance.get(`project/${MyId}`).then((res) => {
      setMyData(res.data);
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

  const submission = (data) => {
    AxiosInstance.delete(`project/${MyId}/`)
      // then will specificy why action to do next. We can flash successs or redirect to new page. In this case, home page
      .then((res) => {
        nav(`/`);
      });
  };

  return (
    <div>
      {loading ? (
        <p>Loading Data...</p>
      ) : (
        <div>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              backgroundColor: "#0003",
              marginBottom: "10px",
            }}
          >
            <Typography sx={{ marginLeft: "20px", color: "#fff" }}>
              Delete Project: {myData.name}
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
                justifyContent: "start",
                marginBottom: "40px",
              }}
            >
              Are you sure you want to delete project: {myData.name}
            </Box>

            <Box sx={{ width: "30%" }}>
              <Button
                variant="contained"
                onClick={submission}
                sx={{ width: "100%" }}
              >
                Delete the proejct
              </Button>
            </Box>
          </Box>
        </div>
      )}
    </div>
  );
};

export default Edit;
