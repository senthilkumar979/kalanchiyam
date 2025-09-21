import { BankPassbookIcon } from "./BankPassbook";
import { DrivingLicenseIcon } from "./DrivingLicenseIcon";
import { NationalIDIcon } from "./NationalIDIcon";
import { OtherFileIcon } from "./OtherFileIcon";
import { PassportIcon } from "./PassportIcon";
import { VoterIDIcon } from "./VoterIDIcon";

export const PredefinedDocIcon: React.FC<{ fileName: string }> = ({
  fileName,
}) => {
  switch (fileName) {
    case "Passport":
      return <PassportIcon />;
    case "National ID":
      return <NationalIDIcon />;
    case "Voter ID":
      return <VoterIDIcon />;
    case "Driving License":
      return <DrivingLicenseIcon />;
    case "Bank Passbook":
      return <BankPassbookIcon />;
    // case "Ration Card":
    //   return <RationCardIcon />;
    // case "PAN Card":
    //   return <PANCardIcon />;
    // case "Birth Certificate":
    //   return <BirthCertificateIcon />;
    // case "Marriage Certificate":
    //   return <MarriageCertificateIcon />;
    // case "X Marksheet":
    //   return <XMarksheetIcon />;
    // case "XII Marksheet":
    //   return <XIIMarksheetIcon />;
    // case "College Degree":
    //   return <CollegeDegreeIcon />;
    // case "College Marksheet":
    //   return <CollegeMarksheetIcon />;
    default:
      return <OtherFileIcon />;
  }
};
