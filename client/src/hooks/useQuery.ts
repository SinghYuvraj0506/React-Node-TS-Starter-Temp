import { useCallback, useEffect, useState } from "react";
import axios from "axios"

export const useQuery = (url:string, dependency = true) => {
    const [data, setData] = useState<any>(null);      
    const [error, setError] = useState<any>(null);       
    const [loading, setLoading] = useState(true);   
  
    const fetchData = useCallback(async () => {
      if (!dependency) return; 
      setLoading(true);   
      setError(null);   
  
      try {
        const response = await axios.get(url); 
        setData(response.data);                
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }, [url, dependency]);
  
    useEffect(() => {
      fetchData();
    }, [fetchData]);
  
    return { data, loading, error, refetch: fetchData };
  };
  
  