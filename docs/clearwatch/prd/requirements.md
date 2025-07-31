# Requirements

## Functional Requirements (FR)

FR1: Evidence Submission: The system shall allow users to submit evidence of police interactions, including video, images, and text descriptions.

FR2: Tiered Submissions: The system shall support both "Verified" submissions (from registered users) and "Anonymous Tips" and shall distinguish between them on the platform.

FR3: AI Analysis (Revised): The system shall use AI to assist in evidence analysis by automatically generating transcripts, tagging keywords, and identifying key objects (e.g., badge numbers) from video submissions.

FR4: Public Database (Cop-Watch): The system shall maintain a public, searchable database of officers and incidents.

FR5: Data Visualization: The system shall display incident data on an interactive map and in public-facing dashboards.

FR6: Content Feeds: The system shall feature an AI-generated news feed and a user-submitted "Porkchop" feed.

FR7: Content Creation: The system shall provide a public-facing AI-powered Meme Generator.

FR8: Access Control: The system shall support "Anonymous Visitor" and "Registered User" roles with distinct submission capabilities.

FR9: Activist Toolkit (Revised): The system shall provide a public-facing 'Activist Toolkit' page containing a downloadable pack of resources (e.g., printable assets, scripts, guides).

FR10: Whistleblower Portal (Revised): The system shall provide a stand-alone, secure, and anonymous tip form for law enforcement that minimizes data storage.

## Non-Functional Requirements (NFR)

NFR1: Security: The system must ensure the highest level of security, protecting user anonymity and submitted data. It must be architected to resist surveillance and de-anonymization attacks.

NFR2: Performance: Public-facing pages must be fast and lightweight. Evidence submission and AI processing must be asynchronous.

NFR3: Reliability: The platform must maintain high availability and be resilient to sudden spikes in traffic.

NFR4: Usability: The evidence submission process must be extremely simple, intuitive, and empowering.

NFR5: Verifiability: The system must visually and programmatically distinguish between data from "Verified Submissions" and "Anonymous Tips" to maintain credibility.

NFR6: Scalability: The architecture must be able to scale to handle a large and growing volume of data and users.

NFR7: Cost-Effectiveness: Technology choices must consider the project's community-funded nature, prioritizing scalable but cost-effective cloud services.