import { useParams } from "react-router-dom";
import JobDetail from "../pages/Candidate Pages/JobDetail";

const JobDetailWrapper = () => {
  const { id } = useParams();
  return <JobDetail id={id} />;
};

export default JobDetailWrapper;
