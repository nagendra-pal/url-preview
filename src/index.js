import React from "react";
import ReactDom from "react-dom";
import axios from "axios";
import { isEmpty, debounce } from "lodash";
import {
  Body,
  Container,
  StyledInput,
  URLContainer,
  StyledMesage,
  StyledImage,
  StyledTitle,
  StyledDesc,
} from "./styles";

class URLPreview extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      query: "",
      result: {},
      loading: false,
      message: "",
    };
    
    this.debouncedSearch = debounce(query => this.fetchResult(query), 500); // - debounce delay of 500ms
  }

  changeHandler = (e) => {
    const query = e.target.value;

    this.setState({ query, loading: true }, () => {
      this.debouncedSearch(query);
    });
  };

  fetchResult = (query) => {
    const searchURL = `http://api.linkpreview.net/?key=7b5b27b9e08d6cd6fcb193ae8708b589&q=${query}`;

    axios
      .get(searchURL)
      .then((res) => {
        this.setState({ loading: false, message: "", result: res.data });
      })
      .catch((error) => {
        if (axios.isCancel(error) || error) {
          this.setState({
            loading: false,
            message: "Failed to fetch data",
          });
        }
      });
  };

  render() {
    const { query, result, loading, message } = this.state;
    const { image, title, description, url } = result;
    const displayURL =
      (url &&
        url
          .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
          .split("/")[0]
          .toUpperCase()) ||
      "";
    return (
      <Body>
        <Container>
          <StyledInput
            value={query}
            onChange={this.changeHandler}
            placeholder="Plese enter text..."
          ></StyledInput>
          <URLContainer>
            {loading && <span>Loading...</span>}
            {message && <StyledMesage>{message}</StyledMesage>}
            {!isEmpty(result) && (
              <>
                <StyledImage src={image}></StyledImage>
                <StyledTitle>{title}</StyledTitle>
                <StyledDesc>{description}</StyledDesc>
                <a href={url} target="_blank">
                  {displayURL}
                </a>
              </>
            )}
          </URLContainer>
        </Container>
      </Body>
    );
  }
}

ReactDom.render(<URLPreview />, document.getElementById("app"));
