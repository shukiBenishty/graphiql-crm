// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GraphiQL from 'graphiql';
import classnames from 'classnames';

class Explorer extends React.Component {

  constructor(props) {
    super(props);

    super(props);

    this.jwt = {};

    this.state = {

      // REQUIRED for GraphiQL:
      // `fetcher` must be provided in order for GraphiQL to operate
      fetcher: this.props.fetcher,

      // OPTIONAL PARAMETERS
      // GraphQL artifacts
      query: '',
      variables: '',
      response: '',

      // GraphQL Schema
      // If `undefined` is provided, an introspection query is executed
      // using the fetcher.
      schema: undefined,

      // Useful to determine which operation to run
      // when there are multiple of them.
      operationName: null,
      storage: null,
      defaultQuery: null,

      // Custom Event Handlers
      onEditQuery: null,
      onEditVariables: null,
      onEditOperationName: null,

      // GraphiQL automatically fills in leaf nodes when the query
      // does not provide them. Change this if your GraphQL Definitions
      // should behave differently than what's defined here:
      // (https://github.com/graphql/graphiql/blob/master/src/utility/fillLeafs.js#L75)
      getDefaultFieldNames: null,

    }

  }

  handleClickPrettifyButton(event) {
    const editor = this.graphiql.getQueryEditor();
    const currentText = editor.getValue();
    const { parse, print } = require('graphql');
    const prettyText = print(parse(currentText));
    editor.setValue(prettyText);
  }

  graphQLFetcher(graphQLParams) {

    return fetch('http://localhost:3001/graphql?', {
      method: 'post',
      headers: { 'Content-Type': 'application/json',
                 'Authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIzMTMwNjk0ODYiLCJuYmYiOjE1MTQzMDgzODcsImV4cCI6MTUxNDM5NDc4NywiaWF0IjoxNTE0MzA4Mzg3LCJpc3MiOiJ1cm46dGVsLWF2aXY6YXBpIiwiYXVkIjoiZGlnaXRlbCJ9.OsRjCkRX_momn7N9gIZSBiJgGq0pwz_4o1uJvP9qowI'
               },
      body: JSON.stringify(graphQLParams)
    }).then(response => {
      return response.json()
    });

  }

  render() {

    let explorerClass = classnames({
        'graphiql-ide': true,
        'signed-out' : !this.props.enabled
    })

    return(<div className={explorerClass}>
            <GraphiQL schema={null}
                      ref={c => { this.graphiql = c; }} {...this.state}
                      fetcher={this.graphQLFetcher}
                      editorTheme="solarized light">
               <GraphiQL.Logo>TLV Graph<em>i</em>QL</GraphiQL.Logo>
              <GraphiQL.Toolbar>
                  <GraphiQL.Button
                    onClick={this.handleClickPrettifyButton}
                    label="Prettify"
                    title="Prettify Query"
                  />
              </GraphiQL.Toolbar>
            </GraphiQL>
      </div>);
  }

};

Explorer.propTypes = {
  enabled: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
  return {
    enabled: state.loggedIn
  };
};

export default connect(mapStateToProps)(Explorer);
