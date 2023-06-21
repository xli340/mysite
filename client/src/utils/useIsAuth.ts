import { useMeQuery } from "../generated/graphql";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const useIsAuth = () => {
  const { data, loading } = useMeQuery();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !data?.me) {
      navigate("/login");
    }
  }, [loading, data, navigate]);
};
