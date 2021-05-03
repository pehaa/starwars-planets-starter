import { useState, useEffect, useRef } from "react"
import Planet from "./Planet"

const Planets = () => {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(null)
  const cancelRef = useRef(null)
  const controllerRef = useRef(null)

  useEffect(()=> {
    cancelRef.current = false
    controllerRef.current = new AbortController()
    // mounts
    console.log("I mounted")
    return () => {
      //unmounts
      console.log("I unmount")
      cancelRef.current = true
      controllerRef.current.abort()
    }
  }, [])

  useEffect(() => {
    console.log("use effect starts with ", page)
    console.log(cancelRef)
    /*let isCancelled = false
    const controller = new AbortController()
    
    
      //signal: controller.signal
    }) */
    setLoading(true);
    fetch(`https://swapi.dev/api/planets/?page=${page}`, {
      signal: controllerRef.current.signal
    })
      // ⚠️ surtout NE PAS OUBLIER d'ENLEVER ⚠️
      .then((response) => {
        console.log("don't forget me here!!!");
        return new Promise((resolved) => {
          setTimeout(() => resolved(response), 2000);
        });
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Nous n'avons pas pu lire les registres des planètes, status : ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("I get data")
        console.log(data);
        if (!cancelRef.current) {
          console.log("I will update component")
          setHasNext(data.next ? true : false)
          setPlanets((p) => [...p, ...data.results]);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error.message)
        if (!cancelRef.current) {
          setError(error.message);
          setLoading(false);
        }
      });
      return () => {
        /*console.log("clean up")
        console.log("I want to cancel")
        isCancelled = true
        controller.abort()*/
      }
  }, [page]);

  return (
    <>
      <div className="row">
        {planets.map((planet) => {
          return <Planet key={planet.name} planet={planet} />;
        })}
      </div>
      {loading && <p className="text-center">loading...</p>}
      {error && <p className="alert alert-danger">{error}</p>}
      {hasNext && <button type="button" className="btn btn-dark" onClick={() => {setPage(page+1)}} disabled={loading}>
        Suivantes
      </button>}
      {hasNext === false && <p className="bg-dark text-white p-3" >
          Nous avons listé toutes les planètes recensées.
        </p>}
    </>
  );
};


export default Planets
