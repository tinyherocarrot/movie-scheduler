import React from "react";

import Table from "rc-table";
import styled from "styled-components";

const columns = [
  {
    title: "Movie",
    dataIndex: "name",
    key: "name",
    width: 150,
    align: "center"
  },
  {
    title: "MON",
    dataIndex: "monday",
    key: "monday",
    width: 50,
    align: "center"
  },
  {
    title: "TUE",
    dataIndex: "tuesday",
    key: "tuesday",
    width: 50,
    align: "center"
  },
  {
    title: "WED",
    dataIndex: "wednesday",
    key: "wednesday",
    width: 50,
    align: "center"
  },
  {
    title: "THU",
    dataIndex: "thursday",
    key: "thursday",
    width: 50,
    align: "center"
  },
  {
    title: "FRI",
    dataIndex: "friday",
    key: "friday",
    width: 50,
    align: "center"
  },
  {
    title: "SAT",
    dataIndex: "saturday",
    key: "saturday",
    width: 50,
    align: "center"
  },
  {
    title: "SUN",
    dataIndex: "sunday",
    key: "sunday",
    width: 50,
    align: "center"
  },
  {
    title: "Options",
    dataIndex: "",
    key: "options",
    align: "center",
    width: 100,
    render: () => <a href="#">Remove</a>
  }
];

const BodyRow = styled.tr`
  color: white;
  &:hover {
    background: papayawhip !important;
    color: rgb(8, 10, 52);
    border-radius: 0.5em;
  }
`;

const components = {
  body: {
    row: BodyRow
  }
};

const StyledTable = props => {
  console.log(props);
  return <Table columns={columns} components={components} data={props.data} />;
};

export default StyledTable;
