// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    function select_metadata(parameter){return parameter.id == sample};
    let desired_metadata = metadata.filter(select_metadata);

    // Use d3 to select the panel with id of "#sample-metadata"
    let card_title = d3.select("#sample-metadata");    

    // Use ".html("")" to clear any existing metadata
    card_title.html("");

    // Inside a loop, use d3 to append new tags for each key-value in the filtered metadata.
    card_title.append("html").text(`ID: ${desired_metadata[0].id}`);
    card_title.append("html").text(`ETHNICITY: ${desired_metadata[0].ethnicity}`);
    card_title.append("html").text(`GENDER: ${desired_metadata[0].gender}`);
    card_title.append("html").text(`AGE: ${desired_metadata[0].age}`);
    card_title.append("html").text(`LOCATION: ${desired_metadata[0].location}`);
    card_title.append("html").text(`BBTYPE: ${desired_metadata[0].bbtype}`);
    card_title.append("html").text(`WFREQ: ${desired_metadata[0].wfreq}`);

  });
};

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    function select_sample(parameter){return parameter.id == sample};
    let desired_sample = samples.filter(select_sample);

    // Get the otu_ids, otu_labels, and sample_values
    let ids = desired_sample[0].otu_ids;
    let labels = desired_sample[0].otu_labels;
    let values = desired_sample[0].sample_values;

    // Build a Bubble Chart

    let trace1 = {
      x: ids,
      y: values,
      mode: "markers",
      text: labels,
      hoverinfo: "text+y",
      marker: {
        size: values,
        color: ids,
        opacity: 0.6,
      }
    };

    let bubble_layout = {
      title: "Bacteria Cultures Per Sample",
      showlegend: false,
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"}
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", [trace1], bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let string_ids = ids.map(function(item){
      return `OTU ${item}`;
    });

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace2 = {
      type: "bar",
      x: values.reverse().slice(values.length-10, values.length),
      y: string_ids.reverse().slice(string_ids.length-10, string_ids.length),
      orientation: "h",
      text: labels.reverse().slice(labels.length-10, labels.length),
      hoverinfo: "text"
    };

    let bar_layout = {
      title: "Top 10 Bacteria Cultures Found"
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", [trace2], bar_layout)

  });
};

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown_menu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    for (let i = 0; i < names.length; i++){
      dropdown_menu.append("option").text(names[i])};
    
    // Get the first sample from the list
    let first_sample = dropdown_menu.property("value");

    // Build charts and metadata panel with the first sample
    buildCharts(first_sample);
    buildMetadata(first_sample);

  });
};

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialise the dashboard
init();