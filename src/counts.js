import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  DropdownButton,
  Dropdown,
  Table,
  Form,
  Row,
  Col
} from "react-bootstrap";

import axios from "axios";

import "./styles.css";

export default function App() {
  // State variable that represents the list of
  // react-bootstrap dropdown items currently being displayed in
  // the count selector dropdown
  const [menu, setMenu] = useState([]);
  // State variable that is populated only once on page render.
  // Holds two lists of react-bootstrap dropdown items, one for
  // all cohorts being stored in the db and one for all semesters
  const [items, setItems] = useState({
    cohortList: [],
    semesterList: [],
    cohortDropdowns: [],
    semesterDropdowns: []
  });
  // State variable that represents the current parameter choice
  const [value, setValue] = useState({ title: "", input: "" });
  // State variable that represents the counts being displayed to the user
  const [counts, setCounts] = useState({
    coop: 0,
    total: 0,
    FIR: 0,
    SOP: 0,
    JUN: 0,
    SEN: 0
  });

  // Effect that makes appropriate API call based on the chosen parameter
  // and populates the counts state variable for display to user
  useEffect(() => {
    const regexArr = [/\d{4}-\d{4}$/, /\d{4}\/FA|WI|SM$/];
    let url = "";
    let regIdx = 0;

    if (value.title.toLowerCase() === "cohort") {
      url = "http://127.0.0.1:8000/api/counts_cohort/" + value.input;
    } else {
      url = "http://127.0.0.1:8000/api/counts_semester/" + value.input;
      regIdx = 1;
    }

    // Only call API if the input matches regular expression based
    // on parameter used
    if (regexArr[regIdx].test(value.input)) {
      axios.get(url).then((res) => {
        setCounts({
          coop: res.data.countCoop,
          total: res.data.countTotal,
          FIR: res.data.FIR,
          SOP: res.data.SOP,
          JUN: res.data.JUN,
          SEN: res.data.SEN
        });
      });
    }
  }, [value]);

  // Effect that is run once on page render. Makes an API call which retrieves every unqiue
  // cohort (start date) and semester currently being stored in the database. Stores
  // these values as react-bootstrap dropdown items in the items state variable
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/count_parameters").then((res) => {
      let cohortItems = [];
      for (const cohort of res.data.cohorts) {
        cohortItems.push(
          <Dropdown.Item eventKey={cohort}>{cohort}</Dropdown.Item>
        );
      }

      let semesterItems = [];
      for (const semester of res.data.semesters) {
        semesterItems.push(
          <Dropdown.Item eventKey={semester}>{semester}</Dropdown.Item>
        );
      }

      setItems({
        cohortList: res.data.cohorts,
        semesterList: res.data.semesters,
        cohortDropdowns: cohortItems,
        semesterDropdowns: semesterItems
      });

      setValue({ title: "Cohort", input: res.data.cohorts[0] });

      setMenu(cohortItems);
    });
  }, []);

  return (
    <div className="countsCard">
      <div className="headerDiv">
        <div className="dropdownDiv">
          <DropdownButton
            id="dropdown-basic-button"
            title={value.title}
            variant="danger"
            onSelect={(e) => {
              // setValue({ title: e, input: value.input });
              if (e.toLowerCase() === "cohort") {
                setMenu(items.cohortDropdowns);
                setValue({ title: e, input: items.cohortList[0] });
              } else {
                setMenu(items.semesterDropdowns);
                setValue({ title: e, input: items.semesterList[0] });
              }
            }}
          >
            <Dropdown.Item eventKey="Cohort">Cohort</Dropdown.Item>
            <Dropdown.Item eventKey="Semester">Semester</Dropdown.Item>
          </DropdownButton>
        </div>
        <div className="formDiv">
          <Form>
            <Row>
              <Col>
                <DropdownButton
                  id="dropdown-basic-button"
                  title={value.input}
                  variant="danger"
                  onSelect={(e) => setValue({ title: value.title, input: e })}
                >
                  {menu}
                </DropdownButton>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <div className="tableDiv">
        <Table hover size="sm">
          <thead>
            <tr>
              <th></th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody className = "counts_tbody">
            <tr>
              <td>Total</td>
              <td>{counts.total}</td>
            </tr>
            <tr>
              <td>Coop</td>
              <td>{counts.coop}</td>
            </tr>
            <tr>
              <td>FIR</td>
              <td>{counts.FIR}</td>
            </tr>
            <tr>
              <td>SOP</td>
              <td>{counts.SOP}</td>
            </tr>
            <tr>
              <td>JUN</td>
              <td>{counts.JUN}</td>
            </tr>
            <tr>
              <td>SEN</td>
              <td>{counts.SEN}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}