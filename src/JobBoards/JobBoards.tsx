import Linkedin from "../assets/linkedin-icon.svg";
import Indeed from "../assets/indeed-logo.svg";
import HelloWork from "../assets/hello-work-logo.svg";
import WelcomeToTheJungle from "../assets/wttj-logo.png";
import Bevopr from "../assets/bevopr-logo.png";
import Circular from "../assets/circular-logo.jpg";
import JeanPaul from "../assets/jean-paul-logo.jpg";
import Kicklok from "../assets/kicklox-logo.png";
import Apec from "../assets/apec-logo.png";
import { Grid } from "@chakra-ui/react";

const jobBoardsData = [
    { name: "LinkedIn", link: "https://www.linkedin.com/jobs/", logo: Linkedin },
    { name: "Indeed", link: "https://fr.indeed.com/?r=us", logo: Indeed },
    { name: "Hello Work", link: "https://www.hellowork.com/fr-fr/candidat/offres.html", logo: HelloWork },
    { name: "Welcome to the Jungle", link: "https://www.welcometothejungle.com/fr/jobs", logo: WelcomeToTheJungle },
    { name: "Apec", link: "https://www.apec.fr/candidat/recherche-emploi.html/emploi?motsCles=d%C3%A9veloppeur%20front&typesTeletravail=20767&niveauxExperience=101881", logo: Apec },
    { name: "Bevopr", link: "https://bevopr.io/explorer-jobs", logo: Bevopr },
    { name: "Circular", link: "https://circular.io/candidates/", logo: Circular },
    { name: "Jean Paul", link: "https://www.jean-paul.io/profil", logo: JeanPaul },
    { name: "Kicklok", link: "https://app.kicklox.com/matches", logo: Kicklok }
];

const JobBoards = () => {
    return (
        <Grid
            gridTemplateColumns='repeat(auto-fill, minmax(100px, 1fr))'
            gap={4}
            placeItems={'center'}
        >
            {jobBoardsData.map((jobBoard) => (
                <a href={jobBoard.link} target="_blank" rel="noreferrer" className="job-board__card" key={jobBoard.name}>
                    <div className="job-board__img-container">
                        <img src={jobBoard.logo} alt={`Logo of ${jobBoard.name} job board`} />
                    </div>
                </a>
            ))}
        </Grid>
    );
}

export default JobBoards;