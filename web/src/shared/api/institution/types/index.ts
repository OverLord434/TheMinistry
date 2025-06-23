export type InstitutionSectionType = {
  name: string;
  status: string;
  found_attrs: string;
  missing_attrs: string;
  required_attrs: string;
};

export type DataInstitutionType = {
    status: string;
    organization: string;
    sections: InstitutionSectionType[]

}

export type TypeCheckApi = {
    url: string;
    send_to_email: boolean;
}
