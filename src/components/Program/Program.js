import { useContext, useEffect, useState } from "react";
import { Card, Carousel, Collapse, Timeline, Badge, Button, Spin } from "antd";
import "./Program.css";
import { Link } from "react-router-dom";
import { DataStore } from "../Database";
import {
  getConferenceProgram,
  getParallelSession1,
  getParallelSession2,
} from "../../service/DataService";
import pattern from "../imgs/pattern.png";

const { Panel } = Collapse;

const Program = () => {
  const [conferenceProgram, setConferenceProgram] = useState([]);
  const [parallelSession1, setParallelSession1] = useState([]);
  const [parallelSession2, setParallelSession2] = useState([]);

  const handleGetParallelSessions = async () => {
    try {
      const [response1, response2, response3] = await Promise.all([
        getConferenceProgram(),
        getParallelSession1(),
        getParallelSession2(),
      ]);

      setConferenceProgram(response1.data);
      setParallelSession1(response2.data);
      setParallelSession2(response3.data);
    } catch (error) {
      console.error("Error while fetching Registration:", error);
    }
  };

  const handleClosePopup = () => {
    const details = document.querySelectorAll("details");
    details.forEach((detail) => {
      detail.removeAttribute("open");
    });
  };

  useEffect(() => {
    handleGetParallelSessions();
  }, []);

  return (
    <div className="Program">
      <div className="Submission_Guideline_tital">
        <h1>Conference Program</h1>
      </div>
      {/* <div>
                <h2 style={{textAlign: "center", marginTop: "50px"}}>Updating...</h2>
            </div> */}
      <div className="Session_Container">
        <div>
          <div className="Session_item">
            <h2>
              I. {conferenceProgram[0]?.session} (ROOM{" "}
              {conferenceProgram[0]?.room})
            </h2>
            <h3>{conferenceProgram[0]?.date}</h3>
          </div>
          <div className="Session_timeline">
            <Timeline pending>
              {conferenceProgram[0]?.content.map((item, index) => (
                <Timeline.Item key={index}>
                  <div className="Session_timeline_item">
                    <div className="Session_timeline_node">
                      <strong>{item?.Time}</strong>
                    </div>
                    <div className="Session_timeline_description">
                      {item?.Type === "Normal" ? (
                        <p>{item?.Text}</p>
                      ) : item?.Type === "Opening" ? (
                        <>
                          <p>{item?.Text}</p>
                          <p>
                            <strong style={{ fontWeight: 600 }}>
                              Opening speech:
                            </strong>{" "}
                            {item?.Opening_speech}
                          </p>
                          <p>
                            <strong style={{ fontWeight: 600 }}>
                              Seminar preliminary:
                            </strong>{" "}
                            {item?.Seminar_preliminary}
                          </p>
                        </>
                      ) : (
                        <>
                          <h3 className="Keynote_Speech_Title">
                            <span>{item?.Name}</span>
                            {item?.Title}
                          </h3>
                          <div className="Parallel_sessions_item_chairs Keynote_Speech_Speaker">
                            <i className="fa-solid fa-microphone"></i>
                            <span>Speaker:</span>
                            <p>{item?.Speaker}</p>
                          </div>
                          <div className="Parallel_sessions_item_chairs Keynote_Speech_Chairs">
                            <i className="fa-solid fa-user-group"></i>
                            <span>Keynote Session Chairs:</span>
                            {item?.Chairs.map((author, idx) => (
                              <Badge
                                key={idx}
                                count={author}
                                style={{
                                  backgroundColor: "#ededed",
                                  color: "black",
                                  border: "none",
                                }}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </div>
        </div>
        <div>
          <div className="Session_item">
            <h2>II. {conferenceProgram[1]?.session}</h2>
            <h3>{conferenceProgram[1]?.date}</h3>
          </div>
          <div className="Session_timeline">
            <Timeline pending>
              <Timeline.Item>
                <div className="Session_timeline_item">
                  <div className="Session_timeline_node">
                    <strong>{conferenceProgram[1]?.content[0]?.Time}</strong>
                  </div>
                  <div className="Session_timeline_description">
                    <p>{conferenceProgram[1]?.content[0]?.Text}</p>
                  </div>
                </div>
              </Timeline.Item>
              <Timeline.Item>
                <div className="Session_timeline_item">
                  <div className="Session_timeline_node">
                    <strong>{conferenceProgram[1]?.content[1]?.Time}</strong>
                  </div>
                  <div className="Session_timeline_description">
                    <span>Parallel sessions</span>
                    <div className="Parallel_sessions_container">
                      {parallelSession1?.map(
                        (item, index) =>
                          item.times.length > 0 && (
                            <details key={index}>
                              <summary>
                                <Badge.Ribbon
                                  text={item.title}
                                  placement="start"
                                  style={{
                                    fontSize: "12px",
                                    backgroundColor: "#21409a",
                                    transform: "translateY(8px)",
                                  }}
                                >
                                  <div className="Parallel_sessions_item">
                                    <div className="Parallel_sessions_item_room">
                                      <i className="fa-solid fa-star"></i>
                                      <span>Room {index + 1}:</span>
                                      <h3>{item.room}</h3>
                                    </div>
                                    <div className="Parallel_sessions_item_chairs">
                                      <i className="fa-solid fa-user-group"></i>
                                      <span>Session Chairs:</span>
                                      {item.sessionchairs.map((author, idx) => (
                                        <Badge
                                          key={idx}
                                          count={author}
                                          style={{
                                            backgroundColor: "#ededed",
                                            color: "black",
                                          }}
                                        />
                                      ))}
                                    </div>
                                    <img
                                      src={pattern}
                                      className="Parallel_sessions_item_pattern"
                                      alt=""
                                    />
                                  </div>
                                </Badge.Ribbon>
                              </summary>
                              <div>
                                <div className="ViewMore_Modal_Room">
                                  <div className="ViewMore_Modal_Room_Title">
                                    <span>
                                      ROOM {index + 1}: {item.room}{" "}
                                      <p>({item.title})</p>
                                    </span>
                                    <Button
                                      onClick={() => handleClosePopup()}
                                      icon={
                                        <i className="fa-solid fa-xmark"></i>
                                      }
                                    />
                                  </div>
                                  <div className="ViewMore_Modal_Room_Timeline">
                                    <Timeline>
                                      {item.times.map((time, idx) => (
                                        <Timeline.Item key={idx}>
                                          <div className="Session_timeline_item Room_item">
                                            <div className="Session_timeline_node">
                                              <strong>{time.time}</strong>
                                            </div>
                                            <div className="Session_timeline_description">
                                              <strong>{time.title}</strong>
                                              <div className="Parallel_sessions_item_chairs">
                                                <i className="fa-solid fa-user-group"></i>
                                                <span>Authors:</span>
                                                {time.authors.map(
                                                  (author, idx) => (
                                                    <Badge
                                                      key={idx}
                                                      count={author}
                                                      style={{
                                                        backgroundColor:
                                                          "#ededed",
                                                        color: "black",
                                                      }}
                                                    />
                                                  )
                                                )}
                                              </div>
                                              <div className="Parallel_sessions_item_chairs">
                                                <i className="fa-solid fa-user-group"></i>
                                                <span>Session Chairs:</span>
                                                {time.chairs.map(
                                                  (author, idx) => (
                                                    <Badge
                                                      key={idx}
                                                      count={author}
                                                      style={{
                                                        backgroundColor:
                                                          "#ededed",
                                                        color: "black",
                                                      }}
                                                    />
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </Timeline.Item>
                                      ))}
                                    </Timeline>
                                  </div>
                                </div>
                              </div>
                            </details>
                          )
                      )}
                    </div>
                  </div>
                </div>
              </Timeline.Item>
              <Timeline.Item>
                <div className="Session_timeline_item">
                  <div className="Session_timeline_node">
                    <strong>{conferenceProgram[1]?.content[2]?.Time}</strong>
                  </div>
                  <div className="Session_timeline_description">
                    <p>{conferenceProgram[1]?.content[2]?.Text}</p>
                  </div>
                </div>
              </Timeline.Item>
              <Timeline.Item>
                <div className="Session_timeline_item">
                  <div className="Session_timeline_node">
                    <strong>{conferenceProgram[1]?.content[3]?.Time}</strong>
                  </div>
                  <div className="Session_timeline_description">
                    <span>Parallel sessions</span>
                    <div className="Parallel_sessions_container">
                      {parallelSession2?.map(
                        (item, index) =>
                          item.times.length >= 0 && (
                            <details key={index}>
                              <summary>
                                <Badge.Ribbon
                                  text={item.title}
                                  placement="start"
                                  style={{
                                    fontSize: "12px",
                                    backgroundColor: "#21409a",
                                    transform: "translateY(8px)",
                                  }}
                                >
                                  <div className="Parallel_sessions_item">
                                    <div className="Parallel_sessions_item_room">
                                      <i className="fa-solid fa-star"></i>
                                      <span>Room {index + 1}:</span>
                                      <h3>{item.room}</h3>
                                    </div>
                                    <div className="Parallel_sessions_item_chairs">
                                      <i className="fa-solid fa-user-group"></i>
                                      <span>Session Chairs:</span>
                                      {item.sessionchairs.map((author, idx) => (
                                        <Badge
                                          key={idx}
                                          count={author}
                                          style={{
                                            backgroundColor: "#ededed",
                                            color: "black",
                                          }}
                                        />
                                      ))}
                                    </div>
                                    <img
                                      src={pattern}
                                      className="Parallel_sessions_item_pattern"
                                      alt=""
                                    />
                                  </div>
                                </Badge.Ribbon>
                              </summary>
                              <div>
                                <div className="ViewMore_Modal_Room">
                                  <div className="ViewMore_Modal_Room_Title">
                                    <span>
                                      ROOM {index + 1}: {item.room}{" "}
                                      <p>({item.title})</p>
                                    </span>
                                    <Button
                                      onClick={() => handleClosePopup()}
                                      icon={
                                        <i className="fa-solid fa-xmark"></i>
                                      }
                                    />
                                  </div>
                                  <div className="ViewMore_Modal_Room_Timeline">
                                    <Timeline>
                                      {item.times.map((time, idx) => (
                                        <Timeline.Item key={idx}>
                                          <div className="Session_timeline_item Room_item">
                                            <div className="Session_timeline_node">
                                              <strong>{time.time}</strong>
                                            </div>
                                            <div className="Session_timeline_description">
                                              <strong>{time.title}</strong>
                                              <div className="Parallel_sessions_item_chairs">
                                                <i className="fa-solid fa-user-group"></i>
                                                <span>Authors:</span>
                                                {time.authors.map(
                                                  (author, idx) => (
                                                    <Badge
                                                      key={idx}
                                                      count={author}
                                                      style={{
                                                        backgroundColor:
                                                          "#ededed",
                                                        color: "black",
                                                      }}
                                                    />
                                                  )
                                                )}
                                              </div>
                                              <div className="Parallel_sessions_item_chairs">
                                                <i className="fa-solid fa-user-group"></i>
                                                <span>Session Chairs:</span>
                                                {time.chairs.map(
                                                  (author, idx) => (
                                                    <Badge
                                                      key={idx}
                                                      count={author}
                                                      style={{
                                                        backgroundColor:
                                                          "#ededed",
                                                        color: "black",
                                                      }}
                                                    />
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </Timeline.Item>
                                      ))}
                                    </Timeline>
                                  </div>
                                </div>
                              </div>
                            </details>
                          )
                      )}
                    </div>
                  </div>
                </div>
              </Timeline.Item>
            </Timeline>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Program;
