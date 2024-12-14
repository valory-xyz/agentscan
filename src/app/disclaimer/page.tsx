/* eslint-disable react/no-unescaped-entities */
export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl mb-20">
      <h1 className="text-3xl font-bold mb-6">Disclaimer &amp; Privacy Policy</h1>
      
      <p className="mb-6 text-lg">
        By using Agentscan, you agree to the following terms and conditions:
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-2">Ownership</h2>
          <p>Agentscan is the proprietary product of Explore Labs, Inc.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Affiliation Disclaimer</h2>
          <p>Agentscan is not affiliated with Valory AG or the Autonolas (OLAS) network.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Educational Use Only</h2>
          <p>Agentscan is intended solely for educational purposes. It does not provide financial, legal, or tax advice. Users should consult appropriate professionals for specific advice tailored to their circumstances.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Use at Your Own Risk</h2>
          <p>Agentscan is offered on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, express or implied. Your use of the product is at your own risk.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Limitations of Large Language Models (LLMs)</h2>
          <p>Agentscan utilizes LLM technology, which may generate inaccurate or misleading information (&quot;hallucinations&quot;). Users must independently verify all outputs before acting on them.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">No Endorsement</h2>
          <p>Explore Labs, Inc. does not endorse or warrant the performance, functionality, or reliability of Autonolas agents or related products.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Limitation of Liability</h2>
          <p>Explore Labs, Inc. and its affiliates disclaim all liability for any direct, indirect, incidental, special, or consequential damages arising from your use of Agentscan.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Forward-Looking Statements</h2>
          <p>Any forward-looking statements provided by Agentscan regarding blockchain technology or related ecosystems are speculative and inherently subject to risks and uncertainties. Explore Labs, Inc. is not obligated to update these statements except as required by applicable law.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Privacy and Data Collection</h2>
          <p>
            Agentscan may collect data on user queries, including but not limited to query text, metadata, and timestamps, 
            to improve the product's functionality and user experience. This data is collected, stored, and processed in 
            accordance with Explore Labs, Inc.'s Privacy Policy. By using Agentscan, you consent to this data collection 
            and agree to the terms outlined in the Privacy Policy. Personal data, if provided, will be handled with care 
            and in compliance with applicable privacy laws. Users should avoid inputting sensitive or confidential 
            information into the system.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Use of User Queries:</h2>
          <p>
            Explore Labs, Inc. reserves the right to use anonymized or aggregated user queries for marketing, 
            promotional, or educational purposes, including sharing them on social media or other public platforms. 
            No personally identifiable information will be disclosed in such cases unless explicitly authorized by 
            the user. By using Agentscan, you consent to this use and acknowledge that any shared content will adhere 
            to applicable laws and ethical standards.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">User Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Users must be of legal age and comply with all applicable laws.</li>
            <li>Users bear sole responsibility for independently verifying all information provided by Agentscan.</li>
            <li>Users are solely responsible for ensuring compliance with any tax obligations arising from the use of Agentscan.</li>
          </ul>
        </section>

        <section>
          <p className="text-sm text-gray-600 mt-8">
            This Disclaimer & Privacy Policy was last updated on December 13, 2024. Should you have any questions or 
            require further information, please contact Explore Labs, Inc. directly.
          </p>
        </section>
      </div>
    </div>
  );
} 