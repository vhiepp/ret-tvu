import { Link } from "react-router-dom";
import "./Committee.css";
import { Carousel } from "antd";
import { useContext, useEffect, useState } from "react";
import { DataStore } from "../Database";
import { getActivate, getCommittees } from "../../service/DataService";

const Committee = () => {
  // const Committees = database?.Committees;

  const [Committees, setCommittees] = useState([]);
  const [Activate, setActivate] = useState({});

  const handleGetActivate = async () => {
    try {
      const response = await getActivate();
      setActivate(response.data);
    } catch (error) {}
  };

  const handleGetCommittees = async () => {
    try {
      const response = await getCommittees();
      setCommittees(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    handleGetActivate();
    handleGetCommittees();
  }, []);

  return (
    <div className="Committee">
      <div className="Committee-content">
        <div className="Committee_left">
          {Committees.length === 0 || !Activate.committee ? (
            <div style={{ marginBottom: "2rem" }}>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                }}
              >
                To be updated
              </p>
            </div>
          ) : (
            Committees.map((cm, index) => {
              return (
                <div className="Committee_item" key={index}>
                  <h2>{cm.title}</h2>
                  <div>
                    <ul>
                      {cm.content.map((ct, index) => {
                        return <li>{`${ct}`}</li>;
                      })}
                    </ul>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="Committee_right">
          <div className="Committee_item">
            <h2>Previous Conferences</h2>
            <p>
              <Link to="https://ret.tvu.edu.vn/2024" target="_blank">
                RET 2024
              </Link>
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </p>
            <p>
              <Link
                to="https://sites.google.com/tvu.edu.vn/ret/program"
                target="_blank"
              >
                RET 2023
              </Link>
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </p>
            <p>
              <Link
                target="_blank"
                to="https://sites.google.com/tvu.edu.vn/ret/history/ret-2022"
              >
                RET 2022
              </Link>
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </p>
            <p>
              <Link
                target="_blank"
                to="https://sites.google.com/tvu.edu.vn/ret/history/ret-2021"
              >
                RET 2021
              </Link>
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </p>
            <p>
              <Link
                target="_blank"
                to="https://sites.google.com/tvu.edu.vn/ret/history/ret-2020"
              >
                RET 2020
              </Link>
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </p>
            <p>
              <Link
                target="_blank"
                to="https://sites.google.com/tvu.edu.vn/ret/history/ret-2019"
              >
                RET 2019
              </Link>
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </p>
            <p>
              <Link
                target="_blank"
                to="https://sites.google.com/tvu.edu.vn/ret/history/ret-2018"
              >
                RET 2018
              </Link>
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Committee;
