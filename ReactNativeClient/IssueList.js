import React, {useState} from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    Button,
    useColorScheme,
    View,
  } from 'react-native';

  const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

  function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
  }

  async function graphQLFetch(query, variables = {}) {
    try {
        /****** Q4: Start Coding here. State the correct IP/port******/
        const response = await fetch('http://10.0.2.2:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
        /****** Q4: Code Ends here******/
      });
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
  
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
  }

class IssueFilter extends React.Component {
    render() {
      return (
        <>
        {/****** Q1: Start Coding here. ******/}
        <View>
          <Text>Issue Filter</Text>
        </View>

        {/****** Q1: Code ends here ******/}
        </>
      );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' }
  });

const width= [40,80,80,80,80,80,200];

function IssueRow(props) {
    const issue = props.issue;
    {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
    const row = [
      issue.id.toString(),
      issue.owner,
      issue.status,
      issue.created.toLocaleDateString(),
      issue.effort ? issue.effort.toString() : "N/A",
      issue.due ? issue.due.toLocaleDateString() : "N/A",
      issue.title,
  ];
    {/****** Q2: Coding Ends here.******/}
    return (
      <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
      <Row
            data={row}
            style={styles.row}
            textStyle={styles.text}
        />
      {/****** Q2: Coding Ends here. ******/}  
      </>
    );
  }
  
  
  function IssueTable(props) {
    const issueRows = props.issues.map(issue =>
      <IssueRow key={issue.id} issue={issue} />
    );

    {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
    const tableHead = ["ID", "Owner", "Status", "Created", "Effort", "Due", "Title"];

    {/****** Q2: Coding Ends here. ******/}
    
    
    return (
    <View style={styles.container}>
    {/****** Q2: Start Coding here to render the table header/rows.**********/}
        <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
                <Row
                    data={tableHead}
                    style={styles.header}
                    textStyle={styles.text}
                />
                <TableWrapper style={styles.dataWrapper}>
                    {issueRows}
                </TableWrapper>
        </Table>
    {/****** Q2: Coding Ends here. ******/}
    </View>
    );
  }

  
  class IssueAdd extends React.Component {
    constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
      /****** Q3: Start Coding here. Create State to hold inputs******/
      this.state = { title: "", owner: "", effort: "" };
      /****** Q3: Code Ends here. ******/
    }
  
    /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    handleInputChange(field, value) {
      this.setState({ [field]: value });
  }
    /****** Q3: Code Ends here. ******/
    
    handleSubmit() {
      /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
      const { title, owner, effort } = this.state;
      const newIssue = {
          title,
          owner,
          effort: parseInt(effort, 10),
          status: "New", 
        };

          this.props.createIssue(newIssue);
          this.setState({ title: "", owner: "", effort: "" });
      /****** Q3: Code Ends here. ******/
    }
  
    render() {
      return (
          <View>
          {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
              <TextInput
                    placeholder="Title"
                    value={this.state.title}
                    onChangeText={(value) => this.handleInputChange("title", value)}
                    style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
              />
              <TextInput
                    placeholder="Owner"
                    value={this.state.owner}
                    onChangeText={(value) => this.handleInputChange("owner", value)}
                    style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
              />
              <TextInput
                    placeholder="Effort"
                    value={this.state.effort}
                    onChangeText={(value) => this.handleInputChange("effort", value)}
                    keyboardType="numeric"
                    style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
              />
              <Button title="Add Issue" onPress={this.handleSubmit} />
          {/****** Q3: Code Ends here. ******/}
          </View>
      );
    }
  }

class BlackList extends React.Component {
    constructor()
    {   super();
        this.handleSubmit = this.handleSubmit.bind(this);
        /****** Q4: Start Coding here. Create State to hold inputs******/
        this.state = { owner: "" };
        /****** Q4: Code Ends here. ******/
    }
    /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    handleInputChange(value) {
      this.setState({ owner: value });
  }
    /****** Q4: Code Ends here. ******/

    async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
    const { owner } = this.state;
        if (!owner.trim()) {
          alert("Owner cannot be empty!");
          return;
        }
        const query = `
            mutation addToBlacklist($nameInput: String!) {
                addToBlacklist(nameInput: $nameInput)
            }
        `;
        try {
          const data = await graphQLFetch(query, { nameInput: owner });
          if (data) {
              alert(`Owner "${owner}" added to blacklist!`); 
              this.setState({ owner: "" }); 
          }
        } catch (err) {
          alert(`Failed to add owner to blacklist: ${err.message}`);
        }
    /****** Q4: Code Ends here. ******/
    }

    render() {
    return (
        <View>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
            <TextInput
                    placeholder="Owner"
                    value={this.state.owner}
                    onChangeText={(value) => this.handleInputChange(value)}
                    style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
            />
            <Button title="Add to Blacklist" onPress={this.handleSubmit} />
        {/****** Q4: Code Ends here. ******/}
        </View>
    );
    }
}

export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [] };
        this.createIssue = this.createIssue.bind(this);
    }
    
    componentDidMount() {
    this.loadData();
    }

    async loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
        this.setState({ issues: data.issueList });
    }
    }

    async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
        this.loadData();
    }
    }
    
    
    render() {
    return (
    <>
    {/****** Q1: Start Coding here. ******/}
    <IssueFilter />
    {/****** Q1: Code ends here ******/}


    {/****** Q2: Start Coding here. ******/}
    <IssueTable issues={this.state.issues} />
    {/****** Q2: Code ends here ******/}

    
    {/****** Q3: Start Coding here. ******/}
    <IssueAdd createIssue={this.createIssue} />
    {/****** Q3: Code Ends here. ******/}

    {/****** Q4: Start Coding here. ******/}
    <BlackList />
    {/****** Q4: Code Ends here. ******/}
    </>
      
    );
  }
}
