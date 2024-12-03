export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl mb-20">
      <h1 className="text-3xl font-bold mb-6">Disclaimer & Privacy Policy</h1>
      
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
          <p>Agentscan is offered on an "as is" and "as available" basis without warranties of any kind, express or implied. Your use of the product is at your own risk.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Limitations of Large Language Models (LLMs)</h2>
          <p>Agentscan utilizes LLM technology, which may generate inaccurate or misleading information ("hallucinations"). Users must independently verify all outputs before acting on them.</p>
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
          <h2 className="text-xl font-bold mb-2">User Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Users must be of legal age and comply with all applicable laws.</li>
            <li>Users bear sole responsibility for independently verifying all information provided by Agentscan.</li>
            <li>Users are solely responsible for ensuring compliance with any tax obligations arising from the use of Agentscan.</li>
          </ul>
        </section>
      </div>
    </div>
  );
} 