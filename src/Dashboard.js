import React, { useState , useCallback} from 'react';
import {
  AppBar, Tabs, Tab, Drawer, Box, List, ListItem, Checkbox, ListItemText, Button, IconButton, Divider,TextField
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList,Legend
} from 'recharts';
import { LinearProgress } from '@mui/material';
const dataPie = [
  { name: 'Failed', value: 388, color: '#FF4D4F' },
  { name: 'Working', value: 90, color: '#1890FF' },
  { name: 'Not Checked', value: 70, color: '#FFC069' },
  { name: 'Passed', value: 7311, color: '#73D13D' }
];

const dataDoughnut = [
  { name: 'Connected', value: 400, color: '#73D13D' },
  { name: 'Not Connected', value: 200, color: '#FF4D4F' }
];
const dataBar = [
  { name: 'Critical', value: 22 },
  { name: 'High', value: 15 },
  { name: 'Medium', value: 30 },
  { name: 'Low', value: 8 }
];

const dataBarHorizontal = [
  { name: 'Critical', value: 22 },
  { name: 'High', value: 15 },
  { name: 'Medium', value: 30 },
  { name: 'Low', value: 8 }
];

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    categories: [
      {
        category_name: "CSPM Executive Dashboard",
        widgets: [
          { widget_id: "widget_1", widget_name: "Cloud Accounts", widget_type: "chart_doughnut" },
          { widget_id: "widget_2", widget_name: "Cloud Account Risk Assessment", widget_type: "chart_doughnut" },
        ]
      },
      {
        category_name: "CWPP Dashboard",
        widgets: [
          { widget_id: "widget_3", widget_name: "Top 5 Namespace Specific Alerts", widget_type: "chart_bar" },
          { widget_id: "widget_4", widget_name: "Workload Alerts", widget_type: "chart_bar" },
        ]
      },
      {
        category_name: "Registry Scan",
        widgets: [
          { widget_id: "widget_5", widget_name: "Image Risk Assessment", widget_type: "chart_bar_horizontal" },
          { widget_id: "widget_6", widget_name: "Image Security Issues", widget_type: "chart_bar_horizontal" },
        ]
      }
    ]
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedWidgets, setSelectedWidgets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableWidgets] = useState([
    { id: 1, name: "Cloud Accounts", category: "CSPM", type: "chart_pie" },
    { id: 2, name: "Cloud Account Risk Assessment", category: "CSPM", type: "chart_pie" },
    { id: 3, name: "Top 5 Namespace Specific Alerts", category: "CWPP", type: "chart_bar" },
    { id: 4, name: "Workload Alerts", category: "CWPP", type: "chart_bar" },
    { id: 5, name: "Image Risk Assessment", category: "Image", type: "chart_bar_horizontal" },
    { id: 6, name: "Image Security Issues", category: "Image", type: "chart_bar_horizontal" },
    { id: 7, name: "Widget 7", category: "Ticket", type: "chart_pie" },
    { id: 8, name: "Widget 8", category: "Ticket", type: "chart_bar" },
  ]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleWidgetToggle = (widgetId) => {
    setSelectedWidgets(prevSelected => {
      const isSelected = prevSelected.includes(widgetId);
      return isSelected ? prevSelected.filter(id => id !== widgetId) : [...prevSelected, widgetId];
    });
  };

  const handleAddWidgets = () => {
    setDashboard(prevDashboard => {
      const updatedCategories = prevDashboard.categories.map((category, index) => {
        if (index === selectedCategory) {
          const newWidgets = selectedWidgets.map(widgetId => {
            const widget = availableWidgets.find(w => w.id === widgetId);
            return {
              widget_id: `widget_${widgetId}`,
              widget_name: widget.name,
              widget_type: widget.type
            };
          });
          return {
            ...category,
            widgets: [...category.widgets, ...newWidgets]
          };
        }
        return category;
      });
      return { ...prevDashboard, categories: updatedCategories };
    });
    setDrawerOpen(false);
    setSelectedWidgets([]);
  };

  const handleRemoveWidget = (category_name, widget_id) => {
    setDashboard(prevDashboard => {
      const updatedCategories = prevDashboard.categories.map(category => {
        if (category.category_name === category_name) {
          return {
            ...category,
            widgets: category.widgets.filter(widget => widget.widget_id !== widget_id)
          };
        }
        return category;
      });
      return { ...prevDashboard, categories: updatedCategories };
    });
  };

  const getAvailableWidgetsByCategory = useCallback((category) => {
    return availableWidgets
      .filter(widget => widget.category === category)
      .filter(widget => widget.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [availableWidgets, searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query state
  };
  return (
    <div className="App">
      <div className="header">
        <div className="search-container">
          <TextField
            placeholder="Search Widgets"
            variant="outlined"
            size="small"
            className="search-bar"
            value={searchQuery} // Bind the search query state
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <h2>CSPM Executive Dashboard</h2>
      <div className="cards-container">
        {dashboard.categories[0].widgets.map(widget => (
          <div key={widget.widget_id} className="card">
            <h3>{widget.widget_name}</h3>

            {widget.widget_type === "chart_pie" && (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={dataPie} dataKey="value" outerRadius={80} label>
                    {dataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}

            {widget.widget_type === "chart_doughnut" && (  // Doughnut chart
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dataDoughnut}
                    dataKey="value"
                    outerRadius={80}
                    innerRadius={50} // Adjust for Doughnut effect
                    label
                  >
                    {dataDoughnut.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}

            <IconButton
              onClick={() => handleRemoveWidget(dashboard.categories[0].category_name, widget.widget_id)}
              size="small"
              className="remove-icon"
            >
              <CloseIcon />
            </IconButton>
          </div>
        ))}
        <div className="card add-widget-card" onClick={handleDrawerToggle}>
          <AddIcon fontSize="large" />
          <h3>Add Widget</h3>
        </div>
      </div>

      <h2>CWPP Dashboard</h2>
      <div className="cards-container">
        {dashboard.categories[1].widgets.map(widget => (
          <div key={widget.widget_id} className="card">
            <h3>{widget.widget_name}</h3>
            {/* Chart rendering logic */}
          </div>
        ))}
        <div className="card add-widget-card" onClick={handleDrawerToggle}>
          <AddIcon fontSize="large" />
          <h3>Add Widget</h3>
        </div>
      </div>

      <h2>Registry Scan</h2>
<div className="cards-container">
  {dashboard.categories[2].widgets.map(widget => (
    <div key={widget.widget_id} className="card">
      <h3>{widget.widget_name}</h3>
      
      {/* Progress Bar */}
      <LinearProgress variant="determinate" value={50} />

      {widget.widget_type === "chart_pie" && (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={dataPie} dataKey="value" outerRadius={80} label>
              {dataPie.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
      
      {widget.widget_type === "chart_bar" && (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dataBar}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
      
      {widget.widget_type === "chart_bar_horizontal" && (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={dataBarHorizontal}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8">
              <LabelList dataKey="value" position="insideLeft" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
      
      <IconButton
        onClick={() => handleRemoveWidget(dashboard.categories[2].category_name, widget.widget_id)}
        size="small"
        className="remove-icon"
      >
        <CloseIcon />
      </IconButton>
    </div>
  ))}
  <div className="card add-widget-card" onClick={handleDrawerToggle}>
    <AddIcon fontSize="large" />
    <h3>Add Widget</h3>
  </div>
</div>

      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
        <div className="drawer">
          <h2>Add Widget</h2>
          <Tabs
            value={selectedCategory}
            onChange={(e, newValue) => setSelectedCategory(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="CSPM" />
            <Tab label="CWPP" />
            <Tab label="Image" />
            <Tab label="Ticket" />
          </Tabs>
          <Divider />
          <Box p={2}>
            <List>
              {getAvailableWidgetsByCategory(['CSPM', 'CWPP', 'Image', 'Ticket'][selectedCategory]).map(widget => (
                <ListItem key={widget.id} dense button onClick={() => handleWidgetToggle(widget.id)}>
                  <Checkbox
                    checked={selectedWidgets.includes(widget.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={widget.name} />
                </ListItem>
              ))}
            </List>
          </Box>
          <Button variant="contained" color="primary" onClick={handleAddWidgets}>
            Add Selected Widgets
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

export default Dashboard;
