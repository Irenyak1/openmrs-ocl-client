import React, { useEffect } from "react";
import { DictionaryForm } from "../components";
import { Grid, Paper } from "@material-ui/core";
import { connect } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import {
  createDictionaryLoadingSelector,
  createDictionaryProgressSelector,
  createSourceAndDictionaryErrorsSelector,
  resetCreateDictionaryAction,
  retrieveDictionaryAndDetailsAction,
  dictionarySelector
} from "../redux";
import { APIDictionary, Dictionary } from "../types";
import {
  orgsSelector,
  profileSelector,
} from "../../authentication/redux/reducer";
import { APIOrg, APIProfile } from "../../authentication";
import { usePrevious, CONTEXT } from "../../../utils";
import { createSourceAndDictionaryAction } from "../redux/actions";
import Header from "../../../components/Header";
import { getDictionaryTypeFromPreviousPath } from "../utils";
import { AppState } from "../../../redux";
import { useQueryParams } from "../../../utils";
interface Props {
  errors?: {};
  profile?: APIProfile;
  usersOrgs?: APIOrg[];
  createSourceAndDictionary: (
    ...args: Parameters<typeof createSourceAndDictionaryAction>
  ) => void;
  retrieveDictionaryAndDetails: (
    ...args: Parameters<typeof retrieveDictionaryAndDetailsAction>
  ) => void;
  loading: boolean;
  newDictionary?: APIDictionary;
  dictionary?: APIDictionary;
  resetCreateDictionary: () => void;
}
interface UseLocation {
  prevPath: string;
}

const CreateDictionaryPage: React.FC<Props> = ({
  profile,
  usersOrgs,
  errors,
  createSourceAndDictionary,
  retrieveDictionaryAndDetails,
  loading,
  resetCreateDictionary,
  newDictionary,
  dictionary
}: Props) => {
  const previouslyLoading = usePrevious(loading);
  const { state } = useLocation<UseLocation>();

  const { copyFrom } = useQueryParams<{
    copyFrom: string;
  }>();

  const previousPath = state ? state.prevPath : "";

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => resetCreateDictionary, []);

  useEffect(() => {
    if (copyFrom !== undefined) {
      retrieveDictionaryAndDetails(copyFrom);
    }
  }, [copyFrom, retrieveDictionaryAndDetails]);

  if (!loading && previouslyLoading && newDictionary) {
    return <Redirect to={newDictionary.url} />;
  }

  return (
    <Header
      title={`${getDictionaryTypeFromPreviousPath(
        previousPath
      )} > Create Dictionary`}
      backUrl="/user/collections/"
      backText="Back to dictionaries"
      justifyChildren="space-around"
    >
      <Grid id="create-dictionary-page" item xs={6} component="div">
        <Paper>
          <DictionaryForm
            context={CONTEXT.create}
            errors={errors}
            profile={profile}
            usersOrgs={usersOrgs ? usersOrgs : []}
            loading={loading}
            copiedDictionary={dictionary}
            onSubmit={(values: Dictionary, references: { [key: string]: string }[]) => createSourceAndDictionary(values, references)}
          />
        </Paper>
      </Grid>
    </Header>
  );
};

const mapStateToProps = (state: AppState) => ({
  profile: profileSelector(state),
  usersOrgs: orgsSelector(state),
  loading: createDictionaryLoadingSelector(state),
  progress: createDictionaryProgressSelector(state),
  newDictionary: state.dictionaries.newDictionary,
  dictionary: dictionarySelector(state),
  errors: createSourceAndDictionaryErrorsSelector(state),
});
const mapActionsToProps = {
  createSourceAndDictionary: createSourceAndDictionaryAction,
  retrieveDictionaryAndDetails: retrieveDictionaryAndDetailsAction,
  resetCreateDictionary: resetCreateDictionaryAction
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(CreateDictionaryPage);
