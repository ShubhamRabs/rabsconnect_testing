import React, { PureComponent, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
} from "recharts";
import "./Charts.css";
import { useBootstrap, useMui } from "../../hooks/Hooks";
let crm_countries = document.getElementById('crm_countries');

let colors = ["#295396", "#00C49F",];

if (crm_countries.value.includes('India')) {
  colors.push(...["#ffdc00", "#ed1c24", "#2395dc",]);
}

if (crm_countries.value.includes('UAE')) {
  colors.push(...["#28b16d", "#ef5e4e", "#ba2025",]);
}

/* Date :- 7-09-2023 
   Author name :- shubham sonkar
   creating CustomTooltip function for bar in bargraph 
*/
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} leads : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export const CustomPieChart2 = ({ data }) => {
  const [refresh, setRefresh] = useState(true)
  function generateRandomColorArray() {
    // Generate random values for red, green, and blue components
    const COLORS = []
    for (let index = 0; index < data.length; index++) {
      const red = Math.floor(Math.random() * 256);
      const green = Math.floor(Math.random() * 256);
      const blue = Math.floor(Math.random() * 256);

      // Convert the decimal values to hexadecimal and pad them if needed
      const redHex = red.toString(16).padStart(2, '0');
      const greenHex = green.toString(16).padStart(2, '0');
      const blueHex = blue.toString(16).padStart(2, '0');
      COLORS.push(`#${redHex}${greenHex}${blueHex}`)
    }
    // Combine the components into a hexadecimal color code
    return COLORS;
  }
  const color = useMemo(() => generateRandomColorArray(), [refresh])

  return (
    <ResponsiveContainer height={400}>
      <PieChart width={400} height={400} layout="horizontal" >
        <Legend />
        <Pie
          data={data}
          cx={200}
          cy={200}
          labelLine={false}
          // label
          outerRadius={80}
          dataKey={"value"}
          fill="#8884d8"
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry?.color ? entry.color : color[index % color.length]} />
          ))}
          {/* {console.log(.color)} */}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default function Charts(props) {
  const { Card } = useBootstrap();
  const { Divider, Fade } = useMui();

  return (
    <Fade in direction="up" timeout={800}>
      <Card className="charts-card">
        <Card.Body>
          <Card.Title>{props.title}</Card.Title>
          <Divider sx={{ my: 2 }} />
          <ResponsiveContainer height={400}>
            <BarChart data={props.data} className="bar-chart-container">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Leads" barSize={20} fill="#7b809a">
                {props.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>
    </Fade>
  );
}

// export const CustomPieChart = () => {
//   const data = [
//     { name: "Group A", value: 400 },
//     { name: "Group B", value: 300 },
//     { name: "Group C", value: 300 },
//     { name: "Group D", value: 200 },
//   ];

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

//   const RADIAN = Math.PI / 180;
//   const renderCustomizedLabel = ({
//     cx,
//     cy,
//     midAngle,
//     innerRadius,
//     outerRadius,
//     percent,
//   }) => {
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);

//     return (
//       <text
//         x={x}
//         y={y}
//         fill="white"
//         textAnchor={x > cx ? "start" : "end"}
//         dominantBaseline="central"
//       >
//         {`${(percent * 100).toFixed(0)}%`}
//       </text>
//     );
//   };

//   return (
//     <PieChart width={200} height={200} className="m-auto">
//       <Pie
//         data={data}
//         cx="50%"
//         cy="50%"
//         labelLine={false}
//         label={renderCustomizedLabel}
//         outerRadius={80}
//         fill="#8884d8"
//         dataKey="value"
//       >
//         {data.map((entry, index) => (
//           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//         ))}
//       </Pie>
//     </PieChart>
//   );
// };

export const CustomPieChart = (data) => {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <PieChart width={200} height={200} className="m-auto">
      <Pie
        data={data?.data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={100}
        fill="#8884d8"
        dataKey="count"
        startAngle={90}
        endAngle={-270}
      >
        {data?.data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
    </PieChart>
  );
};

export function CompareCharts(props) {
  const { Card } = useBootstrap();
  const { Divider, Fade } = useMui();

  const CustomCompareTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <h5>{label}</h5>
          <p className="label">{`Current Updated : ${payload[0].payload.current_status_count}`}</p>
          <p className="label">{`Previous Updated : ${payload[0].payload.previous_status_count}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Fade in direction="up" timeout={800}>
      <Card className="charts-card">
        <Card.Header className="bg-white border-0">
          <Card.Title
            className="mb-0"
            style={{ fontSize: "18px", padding: "10px 0" }}
          >
            {props.title}
          </Card.Title>
        </Card.Header>
        <Divider sx={{ my: 2 }} />
        <ResponsiveContainer height={400} width="100%">
          <BarChart data={props.data} className="bar-chart-container">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip content={<CustomCompareTooltip />} />
            <Legend />
            <Bar dataKey="previous_status_count" barSize={40} fill="#7b809a">
              {props.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color + "33"} />
              ))}
            </Bar>
            <Bar dataKey="current_status_count" barSize={40} fill="#7b809a99">
              {props.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Fade>
  );
}