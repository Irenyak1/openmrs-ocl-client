import React, {useEffect, useRef} from 'react';
import {Button, FormControl, InputLabel, MenuItem, Paper, Typography} from "@material-ui/core";
import './DictionaryForm.scss';
import {locales} from "../../../utils";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {TextField, Select} from "formik-material-ui";

interface Props {
    onSubmit: Function,
    loading: boolean,
    status?: string,
}

const DictionarySchema = Yup.object().shape({
    dictionaryName: Yup.string()
        .required('Dictionary name is required'),
    shortCode: Yup.string()
        .required('Short code is required'),
    description: Yup.string()
        .notRequired(),
    preferredSource: Yup.string()
        .required('Select a preferred source')
        .oneOf(['CIEL'], 'This source is not supported'),
    owner: Yup.string()
        .required('Select this dictionary\'s owner'),
    visibility: Yup.string()
        .required('Select who will have access to this dictionary'),
    preferredLanguage: Yup.string()
        .required('Select a preferred language'),
    otherLanguages: Yup.array(Yup.string()),
});

const DictionaryForm: React.FC<Props> = ({onSubmit, loading, status}) => {
    const formikRef: any = useRef(null);

    useEffect(() => {
        const {current: currentRef} = formikRef;
        if (currentRef) {
            currentRef.setSubmitting(loading);
        }
    }, [loading]);

    useEffect(() => {
        const {current: currentRef} = formikRef;
        if (currentRef) {
            currentRef.setStatus(status);
        }
    }, [status]);

    return (
        <Paper id="dictionary-form">
            <Formik
                ref={formikRef}
                initialValues={{
                    dictionaryName: '',
                    shortCode: '',
                    description: '',
                    preferredSource: 'CIEL',
                    owner: '',
                    visibility: '',
                    preferredLanguage: '',
                    otherLanguages: [],
                }}
                validationSchema={DictionarySchema}
                validateOnChange={false}
                onSubmit={() => {}}
            >
                {({isSubmitting, status}) => (
                    <Form>
                        <Field
                            required
                            fullWidth
                            id="dictionaryName"
                            name="dictionaryName"
                            label="Dictionary Name"
                            margin="normal"
                            component={TextField}
                        />
                        <Field
                            required
                            fullWidth
                            id="shortCode"
                            name="shortCode"
                            label="Short Code"
                            margin="normal"
                            component={TextField}
                        />
                        <Field
                            fullWidth
                            multiline
                            rowsMax={4}
                            id="description"
                            name="description"
                            label="Description"
                            margin="normal"
                            component={TextField}
                        />
                        <FormControl
                            fullWidth
                            required
                            margin="normal"
                        >
                            <InputLabel htmlFor="preferredSource">Preferred Source</InputLabel>
                            <Field
                                name="preferredSource"
                                id="preferredSource"
                                component={Select}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="CIEL">CIEL</MenuItem>
                            </Field>
                        </FormControl>
                        <FormControl
                            fullWidth
                            required
                            margin="normal"
                        >
                            <InputLabel htmlFor="owner">Owner</InputLabel>
                            <Field
                                value=""
                                name="owner"
                                id="owner"
                                component={Select}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                            </Field>
                            <Typography color="error" variant="caption" component="div">
                                <ErrorMessage name="owner" component="span" />
                            </Typography>
                        </FormControl>
                        <FormControl
                            fullWidth
                            required
                            margin="normal"
                        >
                            <InputLabel htmlFor="visibility">Visibility</InputLabel>
                            <Field
                                name="visibility"
                                id="visibility"
                                component={Select}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="View">Public</MenuItem>
                                <MenuItem value="None">Private</MenuItem>
                            </Field>
                            <Typography color="error" variant="caption" component="div">
                                <ErrorMessage name="visibility" component="span" />
                            </Typography>
                        </FormControl>
                        <FormControl
                            fullWidth
                            required
                            margin="normal"
                        >
                            <InputLabel htmlFor="preferredLanguage">Preferred Language</InputLabel>
                            <Field
                                name="preferredLanguage"
                                id="preferredLanguage"
                                component={Select}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {locales.map(({value, label}) => <MenuItem value={value}>{label}</MenuItem>)}
                            </Field>
                            <Typography color="error" variant="caption" component="div">
                                <ErrorMessage name="preferredLanguage" component="span" />
                            </Typography>
                        </FormControl>
                        <FormControl
                            fullWidth
                            required
                            margin="normal"
                        >
                            <InputLabel htmlFor="otherLanguages">Other Languages</InputLabel>
                            <Field
                                multiple
                                value={[]}
                                name="otherLanguages"
                                id="otherLanguages"
                                component={Select}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {locales.map(({value, label}) => <MenuItem value={value}>{label}</MenuItem>)}
                            </Field>
                            <Typography color="error" variant="caption" component="div">
                                <ErrorMessage name="otherLanguages" component="span" />
                            </Typography>
                        </FormControl>
                        <br/>
                        <br/>
                        <div id="submit-button">
                            <Button
                                variant="outlined"
                                color="primary"
                                size="medium"
                                type="submit"
                                // disabled={isSubmitting}
                            >
                                Submit
                            </Button>
                            {!status ? <br/> : (
                                <Typography color="error" variant="caption" component="span">
                                    {status}
                                </Typography>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
        </Paper>
    )
};

export default DictionaryForm;
