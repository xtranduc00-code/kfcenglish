export type ReadingPassage = {
    part: 1 | 2 | 3;
    title: string;
    content: string;
};
export type ReadingNotesCompletionBlock = {
    type: "notes";
    instruction: string;
    instructionSub: string;
    title: string;
    items: Array<{
        qNum: number;
        prefix: string;
        suffix?: string;
    }>;
};
export type ReadingTrueFalseNgBlock = {
    type: "trueFalseNg";
    variant?: "yesNoNg";
    instruction: string;
    questions: Array<{
        qNum: number;
        text: string;
    }>;
};
export type ReadingParagraphMatchBlock = {
    type: "paragraphMatch";
    instruction: string;
    letters: string[];
    headings?: Array<{
        letter: string;
        text: string;
    }>;
    items: Array<{
        qNum: number;
        text: string;
    }>;
};
export type ReadingSentenceCompletionBlock = {
    type: "sentenceCompletion";
    instruction: string;
    instructionSub: string;
    items: Array<{
        qNum: number;
        textBefore: string;
        textAfter?: string;
    }>;
};
export type ReadingMatchPersonBlock = {
    type: "matchPerson";
    instruction: string;
    listLabel?: string;
    people: Array<{
        letter: string;
        name: string;
    }>;
    items: Array<{
        qNum: number;
        text: string;
    }>;
};
export type ReadingSummaryCompletionBlock = {
    type: "summary";
    instruction: string;
    instructionSub: string;
    title: string;
    items: Array<{
        qNum: number;
        prefix: string;
        suffix?: string;
    }>;
};
export type ReadingMultipleChoiceBlock = {
    type: "multipleChoice";
    instruction: string;
    questions: Array<{
        qNum: number;
        text: string;
        options: Array<{
            letter: string;
            text: string;
        }>;
    }>;
};
export type ReadingSummaryFromListBlock = {
    type: "summaryFromList";
    instruction: string;
    title?: string;
    options: Array<{
        letter: string;
        text: string;
    }>;
    items: Array<{
        qNum: number;
        prefix: string;
        suffix?: string;
    }>;
};
export type ReadingQuestionBlock = ReadingNotesCompletionBlock | ReadingTrueFalseNgBlock | ReadingParagraphMatchBlock | ReadingSentenceCompletionBlock | ReadingMatchPersonBlock | ReadingSummaryCompletionBlock | ReadingMultipleChoiceBlock | ReadingSummaryFromListBlock;
export type ReadingContentMap = {
    passages: ReadingPassage[];
    parts: {
        1: {
            blocks: ReadingQuestionBlock[];
        };
        2: {
            blocks: ReadingQuestionBlock[];
        };
        3: {
            blocks: ReadingQuestionBlock[];
        };
    };
};
const contentByTest: Record<string, ReadingContentMap> = {
    "cambridge-20|test-1": {
        passages: [
            {
                part: 1,
                title: "The kākāpō",
                content: `The kākāpō is a nocturnal, flightless parrot that is critically endangered and one of New Zealand's unique treasures.

The kākāpō, also known as the owl parrot, is a large, forest-dwelling bird, with a pale owl-like face. Up to 64 cm in length, it has predominantly yellow-green feathers, forward-facing eyes, a large grey beak, large blue feet, and relatively short wings and tail. It is the world's only flightless parrot, and is also possibly one of the world's longest-living birds, with a reported lifespan of up to 100 years.

Kākāpō are solitary birds and tend to occupy the same home range for many years. They forage on the ground and climb high into trees. They often leap from trees and flap their wings, but at best manage a controlled descent to the ground. They are entirely vegetarian, with their diet including the leaves, roots and bark of trees as well as bulbs, and fern fronds.

Kākāpō breed in summer and autumn, but only in years when food is plentiful. Males play no part in incubation or chick-rearing - females alone incubate eggs and feed the chicks. The 1-4 eggs are laid in soil, which is repeatedly turned over before and during incubation. The female kākāpō has to spend long periods away from the nest searching for food, which leaves the unattended eggs and chicks particularly vulnerable to predators.

Before humans arrived, kākāpō were common throughout New Zealand's forests. However, this all changed with the arrival of the first Polynesian settlers about 700 years ago. For the early settlers, the flightless kākāpō was easy prey. They ate its meat and used its feathers to make soft cloaks. With them came the Polynesian dog and rat, which also preyed on kākāpō. By the time European colonisers arrived in the early 1800s, kākāpō had become confined to the central North Island and forested parts of the South Island. The fall in kākāpō numbers was accelerated by European colonisation. A great deal of habitat was lost through forest clearance, and introduced species such as deer depleted the remaining forests of food. Other predators such as cats, stoats and two more species of rat were also introduced. The kākāpō were in serious trouble.

In 1894, the New Zealand government launched its first attempt to save the kākāpō. Conservationist Richard Henry led an effort to relocate several hundred of the birds to predator-free Resolution Island in Fiordland. Unfortunately, the island didn't remain predator free - stoats arrived within six years, eventually destroying the kākāpō population. By the mid-1900s, the kākāpō was practically a lost species. Only a few clung to life in the most isolated parts of New Zealand.

From 1949 to 1973, the newly formed New Zealand Wildlife Service made over 60 expeditions to find kākāpō, focusing mainly on Fiordland. Six were caught, but there were no females amongst them and all but one died within a few months of captivity. In 1974, a new initiative was launched, and by 1977, 18 more kākāpō were found in Fiordland. However, there were still no females. In 1977, a large population of males was spotted in Rakiura - a large island free from stoats, ferrets and weasels. There were about 200 individuals, and in 1980 it was confirmed females were also present. These birds have been the foundation of all subsequent work in managing the species.

Unfortunately, predation by feral cats on Rakiura Island led to a rapid decline in kākāpō numbers. As a result, during 1980-97, the surviving population was evacuated to three island sanctuaries: Codfish Island, Maud Island and Little Barrier Island. However, breeding success was hard to achieve. Rats were found to be a major predator of kākāpō chicks and an insufficient number of chicks survived to offset adult mortality. By 1995, although at least 12 chicks had been produced on the islands, only three had survived. The kākāpō population had dropped to 51 birds. The critical situation prompted an urgent review of kākāpō management in New Zealand.

In 1996, a new Recovery Plan was launched, together with a specialist advisory group called the Kākāpō Scientific and Technical Advisory Committee and a higher amount of funding. Renewed steps were taken to control predators on the three islands. Cats were eradicated from Little Barrier Island in 1980, and possums were eradicated from Codfish Island by 1986. However, the population did not start to increase until rats were removed from all three islands, and the birds were more intensively managed. This involved moving the birds between islands, supplementary feeding of adults and rescuing and hand-raising any failing chicks.

After the first five years of the Recovery Plan, the population was on target. By 2000, five new females had been produced, and the total population had grown to 62 birds. For the first time, there was cautious optimism for the future of kākāpō and by June 2020, a total of 210 birds was recorded.

Today, kākāpō management continues to be guided by the kākāpō Recovery Plan. Its key goals are: minimise the loss of genetic diversity in the kākāpō population, restore or maintain sufficient habitat to accommodate the expected increase in the kākāpō population, and ensure stakeholders continue to be fully engaged in the preservation of the species.`,
            },
            {
                part: 2,
                title: "Reintroducing elms to Britain",
                content: `Mark Rowe investigates attempts to reintroduce elms to Britain

A. Around 25 million elms, accounting for 90% of all elm trees in the UK, died during the 1960s and '70s of Dutch elm disease. In the aftermath, the elm, once so dominant in the British landscape, was largely forgotten. However, there's now hope the elm may be reintroduced to the countryside of central and southern England. Any reintroduction will start from a very low base. 'The impact of the disease is difficult to picture if you hadn't seen what was there before,' says Matt Elliot of the Woodland Trust. 'You look at old photographs from the 1960s and it's only then that you realise the impact [elms had] ... They were significant, large trees... then they were gone.'

B. The disease is caused by a fungus that blocks the elms' vascular (water, nutrient and food transport) system, causing branches to wilt and die. A first epidemic, which occurred in the 1920s, gradually died down, but in the '70s a second epidemic was triggered by shipments of elm from Canada. The wood came in the form of logs destined for boat building and its intact bark was perfect for the elm bark beetles that spread the deadly fungus. This time, the beetles carried a much more virulent strain that destroyed the vast majority of British elms.

C. Today, elms still exist in the southern English countryside but mostly only in low hedgerows between fields. 'We have millions of small elms in hedgerows but they get targeted by the beetle as soon as they reach a certain size,' says Karen Russell, co-author of the report 'Where we are with elm'. Once the trunk of the elm reaches 10-15 centimetres or so in diameter, it becomes a perfect size for beetles to lay eggs and for the fungus to take hold. Yet mature specimens have been identified, in counties such as Cambridgeshire, that are hundreds of years old, and have mysteriously escaped the epidemic. The key, Russell says, is to identify and study those trees that have survived and work out why they stood tall when millions of others succumbed. Nevertheless, opportunities are limited as the number of these mature survivors is relatively small. 'What are the reasons for their survival?' asks Russell. 'Avoidance, tolerance, resistance? We don't know where the balance lies between the three. I don't see how it can be entirely down to luck.'

D. For centuries, elm ran a close second to oak as the hardwood tree of choice in Britain and was in many instances the most prominent tree in the landscape. Not only was elm common in European forests, it became a key component of birch, ash and hazel woodlands. The use of elm is thought to go back to the Bronze Age, when it was widely used for tools. Elm was also the preferred material for shields and early swords. In the 18th century, it was planted more widely and its wood was used for items such as storage crates and flooring. It was also suitable for items that experienced high levels of impact and was used to build the keel of the 19th-century sailing ship Cutty Sark as well as mining equipment.

E. Given how ingrained elm is in British culture, it's unsurprising the tree has many advocates. Amongst them is Peter Bourne of the National Elm Collection in Brighton. 'I saw Dutch elm disease unfold as a small boy,' he says. 'The elm seemed to be part of rural England, but I remember watching trees just lose their leaves and that really stayed with me.' Today, the city of Brighton's elms total about 17,000. Local factors appear to have contributed to their survival. Strong winds from the sea make it difficult for the determined elm bark beetle to attack this coastal city's elm population. However, the situation is precarious. 'The beetles can just march in if we're not careful, as the threat is right on our doorstep,' says Bourne.

F. Any prospect of the elm returning relies heavily on trees being either resistant to, or tolerant of, the disease. This means a widespread reintroduction would involve existing or new hybrid strains derived from resistant, generally non-native elm species. A new generation of seedlings have been bred and tested to see if they can withstand the fungus by cutting a small slit on the bark and injecting a tiny amount of the pathogen. 'The effects are very quick,' says Russell. 'You return in four to six weeks and trees that are resistant show no symptoms, whereas those that are susceptible show leaf loss and may even have died completely.'

G. All of this raises questions of social acceptance, acknowledges Russell. 'If we're putting elm back into the landscape, a small element of it is not native - are we bothered about that?' For her, the environmental case for reintroducing elm is strong. 'They will host wildlife, which is a good thing. Others are more wary. 'On the face of it, it seems like a good idea,' says Elliot. The problem, he suggests, is that, 'You're replacing a native species with a horticultural analogue*. You're effectively cloning.' There's also the risk of introducing new diseases. Rather than plant new elms, the Woodland Trust emphasises providing space to those elms that have survived independently. 'Sometimes the best thing you can do is just give nature time to recover over time, you might get resistance,' says Elliot.

* horticultural analogue: a cultivated plant species that is genetically similar to an existing species`,
            },
            {
                part: 3,
                title: "How stress affects our judgement",
                content: `Some of the most important decisions of our lives occur while we're feeling stressed and anxious. From medical decisions to financial and professional ones, we are all sometimes required to weigh up information under stressful conditions. But do we become better or worse at processing and using information under such circumstances?

My colleague and I, both neuroscientists, wanted to investigate how the mind operates under stress, so we visited some local fire stations. Firefighters' workdays vary quite a bit. Some are pretty relaxed; they'll spend their time washing the truck, cleaning equipment, cooking meals and reading. Other days can be hectic, with numerous life-threatening incidents to attend to; they'll enter burning homes to rescue trapped residents, and assist with medical emergencies. These ups and downs presented the perfect setting for an experiment on how people's ability to use information changes when they feel under pressure.

We found that perceived threat acted as a trigger for a stress reaction that made the task of processing information easier for the firefighters - but only as long as it conveyed bad news.

This is how we arrived at these results. We asked the firefighters to estimate their likelihood of experiencing 40 different adverse events in their life, such as being involved in an accident or becoming a victim of card fraud. We then gave them either good news (that their likelihood of experiencing these events was lower than they'd thought) or bad news (that it was higher) and asked them to provide new estimates.

People are normally quite optimistic - they will ignore bad news and embrace the good. This is what happened when the firefighters were relaxed; but when they were under stress, a different pattern emerged. Under these conditions, they became hyper-vigilant to bad news, even when it had nothing to do with their job (such as learning that the likelihood of card fraud was higher than they'd thought), and altered their beliefs in response. In contrast, stress didn't change how they responded to good news (such as learning that the likelihood of card fraud was lower than they'd thought).

Back in our lab, we observed the same pattern in students who were told they had to give a surprise public speech, which would be judged by a panel, recorded and posted online. Sure enough, their cortisol levels spiked, their heart rates went up and they suddenly became better at processing unrelated, yet alarming, information about rates of disease and violence.

When we experience stressful events, a physiological change is triggered that causes us to take in warnings and focus on what might go wrong. Brain imaging reveals that this 'switch' is related to a sudden boost in a neural signal important for learning, specifically in response to unexpected warning signs, such as faces expressing fear.

Such neural engineering could have helped prehistoric humans to survive. When our ancestors found themselves surrounded by hungry animals, they would have benefited from an increased ability to learn about hazards. In a safe environment, however, it would have been wasteful to be on high alert constantly. So, a neural switch that automatically increases or decreases our ability to process warnings in response to changes in our environment could have been useful. In fact, people with clinical depression and anxiety seem unable to switch away from a state in which they absorb all the negative messages around them.

It is also important to realise that stress travels rapidly from one person to the next. If a co-worker is stressed, we are more likely to tense up and feel stressed ourselves. We don't even need to be in the same room with someone for their emotions to influence our behaviour. Studies show that if we observe positive feeds on social media, such as images of a pink sunset, we are more likely to post uplifting messages ourselves. If we observe negative posts, such as complaints about a long queue at the coffee shop, we will in turn create more negative posts.

In some ways, many of us now live as if we are in danger, constantly ready to tackle demanding emails and text messages, and respond to news alerts and comments on social media. Repeatedly checking your phone, according to a survey conducted by the American Psychological Association, is related to stress. In other words, a pre-programmed physiological reaction, which evolution has equipped us with to help us avoid famished predators, is now being triggered by an online post. Social media posting, according to one study, raises your pulse, makes you sweat, and enlarges your pupils more than most daily activities.

The fact that stress increases the likelihood that we will focus more on alarming messages, together with the fact that it spreads extremely rapidly, can create collective fear that is not always justified. After a stressful public event, such as a natural disaster or major financial crash, there is often a wave of alarming information in traditional and social media, which individuals become very aware of. But that has the effect of exaggerating existing danger. And so, a reliable pattern emerges - stress is triggered, spreading from one person to the next, which temporarily enhances the likelihood that people will take in negative reports, which increases stress further. As a result, trips are cancelled, even if the disaster took place across the globe; stocks are sold, even when holding on is the best thing to do. The good news, however, is that positive emotions, such as hope, are contagious too, and are powerful in inducing people to act to find solutions. Being aware of the close relationship between people's emotional state and how they process information can help us frame our messages more effectively and become conscientious agents of change.`,
            },
        ],
        parts: {
            1: {
                blocks: [
                    {
                        type: "trueFalseNg",
                        instruction: "Do the following statements agree with the information given in Reading Passage 1? In boxes 1-6 on your answer sheet, write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.",
                        questions: [
                            { qNum: 1, text: "There are other parrots that share the kakapo's inability to fly." },
                            { qNum: 2, text: "Adult kakapo produce chicks every year." },
                            { qNum: 3, text: "Adult male kakapo bring food back to nesting females." },
                            { qNum: 4, text: "The Polynesian rat was a greater threat to the kakapo than Polynesian settlers." },
                            { qNum: 5, text: "Kakapo were transferred from Rakiura Island to other locations because they were at risk from feral cats." },
                            { qNum: 6, text: "One Recovery Plan initiative that helped increase the kakapo population size was caring for struggling young birds." },
                        ],
                    },
                    {
                        type: "notes",
                        instruction: "Complete the notes below.",
                        instructionSub: "Choose ONE WORD AND/OR A NUMBER from the passage for each answer.",
                        title: "New Zealand's kākāpō",
                        items: [
                            { qNum: 7, prefix: "● diet consists of fern fronds, various parts of a tree and ", suffix: "" },
                            { qNum: 8, prefix: "● nests are created in ", suffix: " where eggs are laid." },
                            { qNum: 9, prefix: "● the ", suffix: " of the käkāpō were used to make clothes." },
                            { qNum: 10, prefix: "● ", suffix: " were an animal which they introduced that ate the kākāpō's food sources." },
                            { qNum: 11, prefix: "● a definite sighting of female kākāpō on Rakiura Island was reported in the year ", suffix: "" },
                            { qNum: 12, prefix: "● the Recovery Plan included an increase in ", suffix: "" },
                            { qNum: 13, prefix: "● a current goal of the Recovery Plan is to maintain the involvement of ", suffix: " in kākāpō protection." },
                        ],
                    },
                ],
            },
            2: {
                blocks: [
                    {
                        type: "paragraphMatch",
                        instruction: "Reading Passage 2 has seven sections, A-G. Which section contains the following information? NB You may use any letter more than once.",
                        letters: ["A", "B", "C", "D", "E", "F", "G"],
                        items: [
                            { qNum: 14, text: "reference to the research problems that arise from there being only a few surviving large elms" },
                            { qNum: 15, text: "details of a difference of opinion about the value of reintroducing elms to Britain" },
                            { qNum: 16, text: "reference to how Dutch elm disease was brought into Britain" },
                            { qNum: 17, text: "a description of the conditions that have enabled a location in Britain to escape Dutch elm disease" },
                            { qNum: 18, text: "reference to the stage at which young elms become vulnerable to Dutch elm disease" },
                        ],
                    },
                    {
                        type: "matchPerson",
                        instruction: "Look at the following statements (19-23) and the list of people below. Match each statement with the correct person, A, B, or C. NB You may use any letter more than once.",
                        people: [
                            { letter: "A", name: "Matt Elliot" },
                            { letter: "B", name: "Karen Russell" },
                            { letter: "C", name: "Peter Bourne" },
                        ],
                        items: [
                            { qNum: 19, text: "If a tree gets infected with Dutch elm disease, the damage rapidly becomes visible." },
                            { qNum: 20, text: "It may be better to wait and see if the mature elms that have survived continue to flourish." },
                            { qNum: 21, text: "There must be an explanation for the survival of some mature elms." },
                            { qNum: 22, text: "We need to be aware that insects carrying Dutch elm disease are not very far away." },
                            { qNum: 23, text: "You understand the effect Dutch elm disease has had when you see evidence of how prominent the tree once was." },
                        ],
                    },
                    {
                        type: "sentenceCompletion",
                        instruction: "Complete the summary below.",
                        instructionSub: "Choose ONE WORD ONLY from the passage for each answer.",
                        items: [
                            { qNum: 24, textBefore: "For hundreds of years, the only tree that was more popular in Britain than elm was ", textAfter: "." },
                            { qNum: 25, textBefore: "In the 18th century, it was grown to provide wood for boxes and ", textAfter: "." },
                            { qNum: 26, textBefore: "Due to its strength, elm was often used for mining equipment and the Cutty Sark's ", textAfter: " was also constructed from elm." },
                        ],
                    },
                ],
            },
            3: {
                blocks: [
                    {
                        type: "multipleChoice",
                        instruction: "Choose the correct letter, A, B, C or D.",
                        questions: [
                            { qNum: 27, text: "In the first paragraph, the writer introduces the topic of the text by", options: [
                                    { letter: "A", text: "defining some commonly used terms." },
                                    { letter: "B", text: "questioning a widely held assumption." },
                                    { letter: "C", text: "mentioning a challenge faced by everyone." },
                                    { letter: "D", text: "specifying a situation which makes us most anxious." },
                                ] },
                            { qNum: 28, text: "What point does the writer make about firefighters in the second paragraph?", options: [
                                    { letter: "A", text: "The regular changes of stress levels in their working lives make them ideal study subjects." },
                                    { letter: "B", text: "The strategies they use to handle stress are of particular interest to researchers." },
                                    { letter: "C", text: "The stressful nature of their job is typical of many public service professions." },
                                    { letter: "D", text: "Their personalities make them especially well-suited to working under stress." },
                                ] },
                            { qNum: 29, text: "What is the writer doing in the fourth paragraph?", options: [
                                    { letter: "A", text: "explaining their findings" },
                                    { letter: "B", text: "justifying their approach" },
                                    { letter: "C", text: "setting out their objectives" },
                                    { letter: "D", text: "describing their methodology" },
                                ] },
                            { qNum: 30, text: "In the seventh paragraph, the writer describes a mechanism in the brain which", options: [
                                    { letter: "A", text: "enables people to respond more quickly to stressful situations." },
                                    { letter: "B", text: "results in increased ability to control our levels of anxiety." },
                                    { letter: "C", text: "produces heightened sensitivity to indications of external threats." },
                                    { letter: "D", text: "is activated when there is a need to communicate a sense of danger." },
                                ] },
                        ],
                    },
                    {
                        type: "matchPerson",
                        instruction: "Complete each sentence with the correct ending, A-G, below.",
                        listLabel: "List of Endings",
                        people: [
                            { letter: "A", name: "made them feel optimistic." },
                            { letter: "B", name: "took relatively little notice of bad news." },
                            { letter: "C", name: "responded to negative and positive information in the same way." },
                            { letter: "D", name: "were feeling under stress." },
                            { letter: "E", name: "put them in a stressful situation." },
                            { letter: "F", name: "behaved in a similar manner, regardless of the circumstances." },
                            { letter: "G", name: "thought it more likely that they would experience something bad." },
                        ],
                        items: [
                            { qNum: 31, text: "At times when they were relaxed, the firefighters usually" },
                            { qNum: 32, text: "The researchers noted that when the firefighters were stressed, they" },
                            { qNum: 33, text: "When the firefighters were told good news, they always" },
                            { qNum: 34, text: "The students' cortisol levels and heart rates were affected when the researchers" },
                            { qNum: 35, text: "In both experiments, negative information was processed better when the subjects" },
                        ],
                    },
                    {
                        type: "trueFalseNg",
                        variant: "yesNoNg",
                        instruction: "Do the following statements agree with the information given in Reading Passage 3? Write YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims of the writer, NOT GIVEN if it is impossible to say what the writer thinks about this.",
                        questions: [
                            { qNum: 36, text: "The tone of the content we post on social media tends to reflect the nature of the posts in our feeds." },
                            { qNum: 37, text: "Phones have a greater impact on our stress levels than other electronic media devices." },
                            { qNum: 38, text: "The more we read about a stressful public event on social media, the less able we are to take the information in." },
                            { qNum: 39, text: "Stress created by social media posts can lead us to take unnecessary precautions." },
                            { qNum: 40, text: "Our tendency to be affected by other people's moods can be used in a positive way." },
                        ],
                    },
                ],
            },
        },
    },
    "cambridge-20|test-2": {
        passages: [
            {
                part: 1,
                title: "Manatees",
                content: `Manatees, also known as sea cows, are aquatic mammals that belong to a group of animals called Sirenia. This group also contains dugongs. Dugongs and manatees look quite alike - they are similar in size, colour and shape, and both have flexible flippers for forelimbs. However, the manatee has a broad, rounded tail, whereas the dugong's is fluked, like that of a whale. There are three species of manatees: the West Indian manatee (Trichechus manatus), the African manatee (Trichechus senegalensis) and the Amazonian manatee (Trichechus inunguis).

Unlike most mammals, manatees have only six bones in their neck - most others, including humans and giraffes, have seven. This short neck allows a manatee to move its head up and down, but not side to side. To see something on its left or its right, a manatee must turn its entire body, steering with its flippers. Manatees have pectoral flippers but no back limbs, only a tail for propulsion. They do have pelvic bones, however - a leftover from their evolution from a four-legged to a fully aquatic animal. Manatees share some visual similarities to elephants. Like elephants, manatees have thick, wrinkled skin. They also have some hairs covering their bodies which help them sense vibrations in the water around them.

Seagrasses and other marine plants make up most of a manatee's diet. Manatees spend about eight hours each day grazing and uprooting plants. They eat up to 15% of their weight in food each day. African manatees are omnivorous - studies have shown that molluscs and fish make up a small part of their diets. West Indian and Amazonian manatees are both herbivores.

Manatees' teeth are all molars - flat, rounded teeth for grinding food. Due to manatees' abrasive aquatic plant diet, these teeth get worn down and they eventually fall out, so they continually grow new teeth that get pushed forward to replace the ones they lose. Instead of having incisors to grasp their food, manatees have lips which function like a pair of hands to help tear food away from the seafloor.

Manatees are fully aquatic, but as mammals, they need to come up to the surface to breathe. When awake, they typically surface every two to four minutes, but they can hold their breath for much longer. Adult manatees sleep underwater for 10-12 hours a day, but they come up for air every 15-20 minutes. Active manatees need to breathe more frequently. It's thought that manatees use their muscular diaphragm and breathing to adjust their buoyancy. They may use diaphragm contractions to compress and store gas in folds in their large intestine to help them float.

The West Indian manatee reaches about 3.5 metres long and weighs on average around 500 kilogrammes. It moves between fresh water and salt water, taking advantage of coastal mangroves and coral reefs, rivers, lakes and inland lagoons. There are two subspecies of West Indian manatee: the Antillean manatee is found in waters from the Bahamas to Brazil, whereas the Florida manatee is found in US waters, although some individuals have been recorded in the Bahamas. In winter, the Florida manatee is typically restricted to Florida. When the ambient water temperature drops below 20°C, it takes refuge in naturally and artificially warmed water, such as at the warm-water outfalls from powerplants.

The African manatee is also about 3.5 metres long and found in the sea along the west coast of Africa, from Mauritania down to Angola. The species also makes use of rivers, with the mammals seen in landlocked countries such as Mali and Niger. The Amazonian manatee is the smallest species, though it is still a big animal. It grows to about 2.5 metres long and 350 kilogrammes. Amazonian manatees favour calm, shallow waters that are above 23°C. This species is found in fresh water in the Amazon Basin in Brazil, as well as in Colombia, Ecuador and Peru.

All three manatee species are endangered or at a heightened risk of extinction. The African manatee and Amazonian manatee are both listed as Vulnerable by the International Union for Conservation of Nature (IUCN). It is estimated that 140,000 Amazonian manatees were killed between 1935 and 1954 for their meat, fat and skin with the latter used to make leather. In more recent years, African manatee decline has been tied to incidental capture in fishing nets and hunting. Manatee hunting is now illegal in every country the African species is found in.

The two subspecies of West Indian manatee are listed as Endangered by the IUCN. Both are also expected to undergo a decline of 20% over the next 40 years. A review of almost 1,800 cases of entanglement in fishing nets and of plastic consumption among marine mammals in US waters from 2009 to 2020 found that at least 700 cases involved manatees. The chief cause of death in Florida manatees is boat strikes. However, laws in certain parts of Florida now limit boat speeds during winter, allowing slow-moving manatees more time to respond.`,
            },
            {
                part: 2,
                title: "Procrastination",
                content: `A psychologist explains why we put off important tasks and how we can break this habit

A. Procrastination is the habit of delaying a necessary task, usually by focusing on less urgent, more enjoyable, and easier activities instead. We all do it from time to time. We might be composing a message to a friend who we have to let down, or putting together an important report for college or work; we're doing our best to avoid doing the job at hand, but deep down we know that we should just be getting on with it. Unfortunately, berating ourselves won't stop us procrastinating again. In fact, it's one of the worst things we can do. This matters because, as my research shows, procrastination doesn't just waste time, but is actually linked to other problems, too.

B. Contrary to popular belief, procrastination is not due to laziness or poor time management. Scientific studies suggest procrastination is, in fact, caused by poor mood management. This makes sense if we consider that people are more likely to put off starting or completing tasks that they are really not keen to do. If just thinking about the task threatens our sense of self-worth or makes us anxious, we will be more likely to put it off. Research involving brain imaging has found that areas of the brain linked to detection of threats and emotion regulation are actually different in people who chronically procrastinate compared to those who don't procrastinate frequently.

C. Tasks that are emotionally loaded or difficult, such as preparing for exams, are prime candidates for procrastination. People with low self-esteem are more likely to procrastinate. Another group of people who tend to procrastinate are perfectionists, who worry their work will be judged harshly by others. We know that if we don't finish that report or complete those home repairs, then what we did can't be evaluated. When we avoid such tasks, we also avoid the negative emotions associated with them. This is rewarding, and it conditions us to use procrastination to repair our mood. If we engage in more enjoyable tasks instead, we get another mood boost. In the long run, however, procrastination isn't an effective way of managing emotions. The 'mood repair' we experience is temporary. Afterwards, people tend to be left with a sense of guilt that not only increases their negative mood, but also reinforces their tendency to procrastinate.

D. So why is this such a problem? When most people think of the costs of procrastination, they think of the toll on productivity. For example, studies have shown that procrastination negatively impacts on student performance. But putting off reading textbooks and writing essays may affect other areas of students' lives. In one study of over 3,000 German students over a six-month period, those who reported procrastinating over their university work were also more likely to engage in study-related misconduct, such as cheating and plagiarism. But the behaviour that procrastination was most closely linked with was using fraudulent excuses to get deadline extensions. Other research shows that employees on average spend almost a quarter of their workday procrastinating, and again this is linked with negative outcomes. In fact, in one US survey of over 22,000 employees, participants who said they regularly procrastinated had less annual income and less employment stability. For every one-point increase on a measure of chronic procrastination, annual income decreased by US$15,000.

E. Procrastination also correlates with serious health and well-being problems. A tendency to procrastinate is linked to poor mental health, including higher levels of depression and anxiety. Across numerous studies, I've found people who regularly procrastinate report a greater number of health issues, such as headaches, flu and colds, and digestive issues. They also experience higher levels of stress and poor sleep quality. They are less likely to practise healthy behaviours, such as eating a healthy diet and regularly exercising, and use destructive coping strategies to manage their stress. In one study of over 700 people, I found people prone to procrastination had a 63% greater risk of poor heart health after accounting for other personality traits and demographics.

F. Finding better ways of managing our emotions is one route out of the vicious cycle of procrastination. An important first step is to manage our environment and how we view the task. There are a number of evidence-based strategies that can help us fend off distractions that can occupy our minds when we should be focusing on the thing we should be getting on with. For example, reminding ourselves about why the task is important and valuable can increase positive feelings towards it. Forgiving ourselves and feeling compassion when we procrastinate can help break the procrastination cycle. We should admit that we feel bad, but not be overly critical of ourselves. We should remind ourselves that we're not the first person to procrastinate, nor the last. Doing this can take the edge off the negative feelings we have about ourselves when we procrastinate. This can all make it easier to get back on track.`,
            },
            {
                part: 3,
                title: "Invasion of the Robot Umpires",
                content: `A few years ago, Fred DeJesus from Brooklyn, New York became the first umpire in a minor league baseball game to use something called the Automated Ball-Strike System (ABS), often referred to as the 'robo-umpire'. Instead of making any judgments himself about a strike, DeJesus had decisions fed to him through an earpiece, connected to a modified missile-tracking system. The contraption looked like a large black pizza box with one glowing green eye; it was mounted above the press stand.

Major League Baseball (MLB), who had commissioned the system, wanted human umpires to announce the calls, just as they would have done in the past. When the first pitch came in, a recorded voice told DeJesus it was a strike. Previously, calling a strike was a judgment call on the part of the umpire. Even if the batter does not hit the ball, a pitch that passes through the 'strike zone' (an imaginary zone about seventeen inches wide, stretching from the batter's knees to the middle of his chest) is considered a strike. During that first game, when DeJesus announced calls, there was no heckling and no shouted disagreement. Nobody said a word.

For a hundred and fifty years or so, the strike zone has been the game's animating force-countless arguments between a team's manager and the umpire have taken place over its boundaries and whether a ball had crossed through it. The rules of play have evolved in various stages. Today, everyone knows that you may scream your disagreement in an umpire's face, but you must never shout personal abuse at them or touch them. That's a no-no. When the robo-umpires came, however, the arguments stopped.

During the first robo-umpire season, players complained about some strange calls. In response, MLB decided to tweak the dimensions of the zone, and the following year the consensus was that ABS is profoundly consistent. MLB says the device is near-perfect, precise to within fractions of an inch. "It'll reduce controversy in the game, and be good for the game," says Rob Manfred, who is Commissioner for MLB. But the question is whether controversy is worth reducing, or whether it is the sign of a human hand. A human, at least, yells back. When I spoke with Frank Viola, a coach for a North Carolina team, he said that ABS works as designed, but that it was also unforgiving and pedantic, almost legalistic. "Manfred is a lawyer," Viola noted. Some pitchers have complained that, compared with a human's, the robot's strike zone seems too precise. Viola was once a major-league player himself. When he was pitching, he explained, umpires rewarded skill. "Throw it where you aimed, and it would be a strike, even if it was an inch or two outside. There was a dialogue between pitcher and umpire."

The executive tasked with running the experiment for MLB is Morgan Sword, who's in charge of baseball operations. According to Sword, ABS was part of a larger project to make baseball more exciting since executives are terrified of losing younger fans, as has been the case with horse racing and boxing. He explains how they began the process by asking fans what version of baseball they found most exciting. The results showed that everyone wanted more action: more hits, more defense, more baserunning. This type of baseball essentially hasn't existed since the 1960s, when the hundred-mile-an-hour fastball, which is difficult to hit and control, entered the game. It flattened the game into strikeouts, walks, and home runs - a type of play lacking much action.

Sword's team brainstormed potential fixes. Any rule that existed, they talked about changing-from changing the bats to changing the geometry of the field. But while all of these were ruled out as potential fixes, ABS was seen as a perfect vehicle for change. According to Sword, once you get the technology right, you can load any strike zone you want into the system. "It might be a triangle, or a blob, or something shaped like Texas. Over time, as baseball evolves, ABS can allow the zone to change with it."

"In the past twenty years, sports have moved away from judgment calls. Soccer has Video Assistant Referees (for offside decisions, for example). Tennis has Hawk-Eye (for line calls, for example). For almost a decade, baseball has used instant replay on the base paths. This is widely liked, even if the precision can sometimes cause problems. But these applications deal with something physical: bases, lines, goals. The boundaries of action are precise, delineated like the keys of a piano. This is not the case with ABS and the strike zone. Historically, a certain discretion has been appreciated."

I decided to email Alva Noë, a professor at Berkeley University and a baseball fan, for his opinion. "Hardly a day goes by that I don't wake up and run through the reasons that this [robo-umpires] is such a terrible idea," he replied. He later told me, "This is part of a movement to use algorithms to take the hard choices of living out of life." Perhaps he's right. We watch baseball to kill time, not to maximize it. Some players I have met take a dissenting stance toward the robots too, believing that accuracy is not the answer. According to Joe Russo, who plays for a New Jersey team, "With technology, people just want everything to be perfect. That's not reality. I think perfect would be weird. Your teams are always winning, work is always just great, there's always money in your pocket, your car never breaks down. What is there to talk about?"

*strike: a strike is when the batter swings at a ball and misses or when the batter does not swing at a ball that passes through the strike zone.`,
            },
        ],
        parts: {
            1: {
                blocks: [
                    {
                        type: "notes",
                        instruction: "Complete the notes below.",
                        instructionSub: "Choose ONE WORD AND/OR A NUMBER from the passage for each answer.",
                        title: "Manatees",
                        items: [
                            { qNum: 1, prefix: "Appearance: look similar to dugongs, but with a differently shaped ", suffix: "" },
                            { qNum: 2, prefix: "Movement: need to use their ", suffix: " to help to turn their bodies around in order to look sideways" },
                            { qNum: 3, prefix: "Movement: sense vibrations in the water by means of ", suffix: " on their skin" },
                            { qNum: 4, prefix: "Feeding: eat mainly aquatic vegetation, such as ", suffix: "" },
                            { qNum: 5, prefix: "Feeding: grasp and pull up plants with their ", suffix: "" },
                            { qNum: 6, prefix: "Breathing: may regulate the ", suffix: " of their bodies by using muscles of diaphragm to store air internally" },
                        ],
                    },
                    {
                        type: "trueFalseNg",
                        instruction: "Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.",
                        questions: [
                            { qNum: 7, text: "West Indian manatees can be found in a variety of different aquatic habitats." },
                            { qNum: 8, text: "The Florida manatee lives in warmer waters than the Antillean manatee." },
                            { qNum: 9, text: "The African manatee's range is limited to coastal waters between the West African countries of Mauritania and Angola." },
                            { qNum: 10, text: "The extent of the loss of Amazonian manatees in the mid-twentieth century was only revealed many years later." },
                            { qNum: 11, text: "It is predicted that West Indian manatee populations will fall in the coming decades." },
                            { qNum: 12, text: "The risk to manatees from entanglement and plastic consumption increased significantly in the period 2009-2020." },
                            { qNum: 13, text: "There is some legislation in place which aims to reduce the likelihood of boat strikes on manatees in Florida." },
                        ],
                    },
                ],
            },
            2: {
                blocks: [
                    {
                        type: "paragraphMatch",
                        instruction: "Reading Passage 2 has six paragraphs, A-F. Which paragraph contains the following information? NB You may use any letter more than once.",
                        letters: ["A", "B", "C", "D", "E", "F"],
                        items: [
                            { qNum: 14, text: "mention of false assumptions about why people procrastinate" },
                            { qNum: 15, text: "reference to the realisation that others also procrastinate" },
                            { qNum: 16, text: "neurological evidence of a link between procrastination and emotion" },
                        ],
                    },
                    {
                        type: "notes",
                        instruction: "Complete the summary below.",
                        instructionSub: "Choose ONE WORD ONLY from the passage for each answer.",
                        title: "What makes us procrastinate?",
                        items: [
                            { qNum: 17, prefix: "Many people think that procrastination is the result of ", suffix: "." },
                            { qNum: 18, prefix: "But scientific studies suggest that procrastination is actually due to poor mood management. The tasks we are most likely to put off are those that could damage our self-esteem or cause us to feel ", suffix: " when we think about them." },
                            { qNum: 19, prefix: "Research comparing chronic procrastinators with other people even found differences in the brain regions associated with regulating emotions and identifying ", suffix: "." },
                            { qNum: 20, prefix: "Getting ready to take ", suffix: " might be a typical example of one such task." },
                            { qNum: 21, prefix: "People who are likely to procrastinate tend to be either ", suffix: " or those with low self-esteem." },
                            { qNum: 22, prefix: "Procrastination is only a short-term measure for managing emotions. It's often followed by a feeling of ", suffix: ", which worsens our mood and leads to more procrastination." },
                        ],
                    },
                    {
                        type: "paragraphMatch",
                        instruction: "Choose TWO letters, A-E. Which TWO comparisons between employees who often procrastinate and those who do not are mentioned in the text?",
                        letters: ["A", "B", "C", "D", "E"],
                        headings: [
                            { letter: "A", text: "Their salaries are lower." },
                            { letter: "B", text: "The quality of their work is inferior." },
                            { letter: "C", text: "They don't keep their jobs for as long." },
                            { letter: "D", text: "They don't enjoy their working lives as much." },
                            { letter: "E", text: "They have poorer relationships with colleagues." },
                        ],
                        items: [
                            { qNum: 23, text: "Answer 1" },
                            { qNum: 24, text: "Answer 2" },
                        ],
                    },
                    {
                        type: "paragraphMatch",
                        instruction: "Choose TWO letters, A-E. Which TWO recommendations for getting out of a cycle of procrastination does the writer give?",
                        letters: ["A", "B", "C", "D", "E"],
                        headings: [
                            { letter: "A", text: "not judging ourselves harshly" },
                            { letter: "B", text: "setting ourselves manageable aims" },
                            { letter: "C", text: "rewarding ourselves for tasks achieved" },
                            { letter: "D", text: "prioritising tasks according to their importance" },
                            { letter: "E", text: "avoiding things that stop us concentrating on our tasks" },
                        ],
                        items: [
                            { qNum: 25, text: "Answer 1" },
                            { qNum: 26, text: "Answer 2" },
                        ],
                    },
                ],
            },
            3: {
                blocks: [
                    {
                        type: "trueFalseNg",
                        variant: "yesNoNg",
                        instruction: "Do the following statements agree with the claims of the writer in Reading Passage 3? Write YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims of the writer, NOT GIVEN if it is impossible to say what the writer thinks about this.",
                        questions: [
                            { qNum: 27, text: "When DeJesus first used ABS, he shared decision-making about strikes with it." },
                            { qNum: 28, text: "MLB considered it necessary to amend the size of the strike zone when criticisms were received from players." },
                            { qNum: 29, text: "MLB is keen to justify the money spent on improving the accuracy of ABS's calculations." },
                            { qNum: 30, text: "The hundred-mile-an-hour fastball led to a more exciting style of play." },
                            { qNum: 31, text: "The differing proposals for alterations to the baseball bat led to fierce debate on Sword's team." },
                            { qNum: 32, text: "ABS makes changes to the shape of the strike zone feasible." },
                        ],
                    },
                    {
                        type: "summaryFromList",
                        instruction: "Complete the summary using the list of phrases, A-H, below.",
                        title: "Calls by the umpire",
                        options: [
                            { letter: "A", text: "pitch boundary" },
                            { letter: "B", text: "numerous disputes" },
                            { letter: "C", text: "team tactics" },
                            { letter: "D", text: "subjective assessment" },
                            { letter: "E", text: "widespread approval" },
                            { letter: "F", text: "former roles" },
                            { letter: "G", text: "total silence" },
                            { letter: "H", text: "perceived area" },
                        ],
                        items: [
                            { qNum: 33, prefix: "Even after ABS was developed, MLB still wanted human umpires to shout out decisions as they had in their ", suffix: "." },
                            { qNum: 34, prefix: "The umpire's job had, at one time, required a ", suffix: " about whether a ball was a strike." },
                            { qNum: 35, prefix: "A ball is considered a strike when the batter does not hit it and it crosses through a ", suffix: " extending approximately from the batter's knee to his chest." },
                            { qNum: 36, prefix: "In the past, ", suffix: " over strike calls were not uncommon, but today everyone accepts the complete ban on pushing or shoving the umpire." },
                            { qNum: 37, prefix: "One difference, however, is that during the first game DeJesus used ABS, strike calls were met with ", suffix: "." },
                        ],
                    },
                    {
                        type: "multipleChoice",
                        instruction: "Choose the correct letter, A, B, C or D.",
                        questions: [
                            { qNum: 38, text: "What does the writer suggest about ABS in the fifth paragraph?", options: [
                                    { letter: "A", text: "It is bound to make key decisions that are wrong." },
                                    { letter: "B", text: "It may reduce some of the appeal of the game." },
                                    { letter: "C", text: "It will lead to the disappearance of human umpires." },
                                    { letter: "D", text: "It may increase calls for the rules of baseball to be changed." },
                                ] },
                            { qNum: 39, text: "Morgan Sword says that the introduction of ABS", options: [
                                    { letter: "A", text: "was regarded as an experiment without a guaranteed outcome." },
                                    { letter: "B", text: "was intended to keep up with developments in other sports." },
                                    { letter: "C", text: "was a response to changing attitudes about the role of sport." },
                                    { letter: "D", text: "was an attempt to ensure baseball retained a young audience." },
                                ] },
                            { qNum: 40, text: "Why does the writer include the views of Noe and Russo?", options: [
                                    { letter: "A", text: "to show that attitudes to technology vary widely" },
                                    { letter: "B", text: "to argue that people have unrealistic expectations of sport" },
                                    { letter: "C", text: "to indicate that accuracy is not the same thing as enjoyment" },
                                    { letter: "D", text: "to suggest that the number of baseball fans needs to increase" },
                                ] },
                        ],
                    },
                ],
            },
        },
    },
    "cambridge-20|test-3": {
        passages: [
            {
                part: 1,
                title: "Frozen Food",
                content: `A US perspective on the development of the frozen food industry

At some point in history, humans discovered that ice preserved food. There is evidence that winter ice was stored to preserve food in the summer as far back as 10,000 years ago. Two thousand years ago, the inhabitants of South America's Andean mountains had a unique means of conserving potatoes for later consumption. They froze them overnight, then trampled them to squeeze out the moisture, then dried them in the sun. This preserved their nutritional value-if not their aesthetic appeal.

Natural ice remained the main form of refrigeration until late in the 19th century. In the early 1800s, ship owners from Boston, USA, had enormous blocks of Arctic ice towed all over the Atlantic for the purpose of food preservation. In 1851, railroads first began putting blocks of ice in insulated rail cars to send butter from Ogdensburg, New York, to Boston.

Finally, in 1870, Australian inventors found a way to make 'mechanical ice'. They used a compressor to force a gas-ammonia at first and later Freon-through a condenser. The compressed gas gave up some of its heat as it moved through the condenser. Then the gas was released quickly into a low-pressure evaporator coil where it became liquid and cold. Air was blown over the evaporator coil and then this cooled air passed into an insulated compartment, lowering its temperature to freezing point.

Initially, this process was invented to keep Australian beer cool even in hot weather. But Australian cattlemen were quick to realize that, if they could put this new invention on a ship, they could export meat across the oceans. In 1880, a shipment of Australian beef and mutton was sent, frozen, to England. While the food frozen this way was still palatable, there was some deterioration. During the freezing process, crystals formed within the cells of the food, and when the ice expanded and the cells burst, this spoilt the flavor and texture of the food.

The modern frozen food industry began with the indigenous Inuit people of Canada. In 1912, a biology student in Massachusetts, USA, named Clarence Birdseye, ran out of money and went to Labrador in Canada to trap and trade furs. While he was there, he became fascinated with how the Inuit would quickly freeze fish in the Arctic air. The fish looked and tasted fresh even months later.

Birdseye returned to the USA in 1917 and began developing mechanical freezers capable of quick-freezing food. Birdseye methodically kept inventing better freezers and gradually built a business selling frozen fish from Gloucester, Massachusetts. In 1929, his business was sold and became General Foods, but he stayed with the company as director of research, and his division continued to innovate.

Birdseye was responsible for several key innovations that made the frozen food industry possible. He developed quick-freezing techniques that reduced the damage that crystals caused, as well as the technique of freezing the product in the package it was to be sold in. He also introduced the use of cellophane, the first transparent material for food packaging, which allowed consumers to see the quality of the product. Birdseye products also came in convenient size packages that could be prepared with a minimum of effort.

But there were still obstacles. In the 1930s, few grocery stores could afford to buy freezers for a market that wasn't established yet. So, Birdseye leased inexpensive freezer cases to them. He also leased insulated railroad cars so that he could ship his products nationwide. However, few consumers had freezers large enough or efficient enough to take advantage of the products.

Sales increased in the early 1940s, when World War II gave a boost to the frozen food industry because tin was being used for munitions. Canned foods were rationed to save tin for the war effort, while frozen foods were abundant and cheap. Finally, by the 1950s, refrigerator technology had developed far enough to make these appliances affordable for the average family. By 1953, 33 million US families owned a refrigerator, and manufacturers were gradually increasing the size of the freezer compartments in them.

1950s families were also looking for convenience at mealtimes, so the moment was right for the arrival of the 'TV Dinner'. Swanson Foods was a large, nationally recognized producer of canned and frozen poultry. In 1954, the company adapted some of Birdseye's freezing techniques, and with the help of a clever name and a huge advertising budget, it launched the first 'TV Dinner'. This consisted of frozen turkey, potatoes and vegetables served in the same segmented aluminum tray that was used by airlines. The product was an instant success. Within a year, Swanson had sold 13 million TV dinners. American consumers couldn't resist the combination of a trusted brand name, a single-serving package and the convenience of a meal that could be ready after only 25 minutes in a hot oven. By 1959, Americans were spending $2.7 billion annually on frozen foods, and half a billion of that was spent on ready-prepared meals such as the TV Dinner.

Today, the US frozen food industry has a turnover of over $67 billion annually, with $26.6 billion of that sold to consumers for home consumption. The remaining $40 billion in frozen food sales come through restaurants, cafeterias, hospitals and schools, and that represents a third of the total food service sales.`,
            },
            {
                part: 2,
                title: "Can the planet's coral reefs be saved?",
                content: `A. Conservationists have put the final touches to a giant artificial reef they have been assembling at the world-renowned Zoological Society of London (London Zoo). Samples of the planet's most spectacular corals - vivid green branching coral, yellow scroll, blue ridge and many more species - have been added to the giant tank along with fish that thrive in their presence: blue tang, clownfish and many others. The reef is in the zoo's new gallery, Tiny Giants, which is dedicated to the minuscule invertebrate creatures that sustain life across the planet. The coral reef tank and its seven-metre-wide window form the core of the exhibition.

'Coral reefs are the most diverse ecosystems on Earth and we want to show people how wonderful they are,' said Paul Pearce-Kelly, senior curator of invertebrates and fish at the Zoological Society of London. 'However, we also want to highlight the research and conservation efforts that are now being carried out to try to save them from the threat of global warming.' They want people to see what is being done to try to save these wonders.

B. Corals are composed of tiny animals, known as polyps, with tentacles for capturing small marine creatures in the sea water. These polyps are transparent but get their brilliant tones of pink, orange, blue, green, etc. from algae that live within them, which in turn get protection, while their photosynthesising of the sun's rays provides nutrients for the polyps. This comfortable symbiotic relationship has led to the growth of coral reefs that cover 0.1% of the planet's ocean bed while providing homes for more than 25% of marine species, including fish, molluscs, sponges and shellfish.

C. As a result, coral reefs are often described as the 'rainforests of the sea', though the comparison is dismissed by some naturalists, including David Attenborough. 'People say you cannot beat the rainforest,' Attenborough has stated. 'But that is simply not true. You go there and the first thing you think is: where are the birds? Where are the animals? They are hiding in the trees, of course. No, if you want beauty and wildlife, you want a coral reef. Put on a mask and stick your head under the water. The sight is mind-blowing.'

D. Unfortunately, these majestic sights are now under very serious threat, with the most immediate problem coming in the form of thermal stress. Rising ocean temperatures are triggering bleaching events that strip reefs of their colour and eventually kill them. And that is just the start. Other menaces include ocean acidification, sea level increase, pollution by humans, deoxygenation and ocean current changes, while the climate crisis is also increasing habitat destruction. As a result, vast areas - including massive chunks of Australia's Great Barrier Reef - have already been destroyed, and scientists advise that more than 90% of reefs could be lost by 2050 unless urgent action is taken to tackle global heating and greenhouse gas emissions.

Pearce-Kelly says that coral reefs have to survive really harsh conditions - wave erosion and other factors. And 'when things start to go wrong in the oceans, then corals will be the first to react. And that is exactly what we are seeing now. Coral reefs are dying and they are telling us that all is not well with our planet.'

E. However, scientists are trying to pinpoint hardy types of coral that could survive our overheated oceans, and some of this research will be carried out at London Zoo. 'Behind our ... coral reef tank we have built laboratories where scientists will be studying coral species,' said Pearce-Kelly. One aim will be to carry out research on species to find those that can survive best in warm, acidic waters. Another will be to try to increase coral breeding rates. 'Coral spawn just once a year,' he added. 'However, aquarium-based research has enabled some corals to spawn artificially, which can assist coral reef restoration efforts. And if this can be extended for all species, we could consider the launching of coral-spawning programmes several times a year. That would be a big help in restoring blighted reefs.'

F. Research in these fields is being conducted in laboratories around the world, with the London Zoo centre linked to this global network. Studies carried out in one centre can then be tested in others. The resulting young coral can then be displayed in the tank in Tiny Giants. 'The crucial point is that the progress we make in making coral better able to survive in a warming world can be shown to the public and encourage them to believe that we can do something to save the planet's reefs,' said Pearce-Kelly. 'Saving our coral reefs is now a critically important ecological goal.'`,
            },
            {
                part: 3,
                title: "Robots and us",
                content: `Three leaders in their fields answer questions about our relationships with robots

When asked 'Should robots be used to colonise other planets?', cosmology and astrophysics Professor Martin Rees said he believed the solar system would be mapped by robotic craft by the end of the century. 'The next step would be mining of asteroids, enabling fabrication of large structures in space without having to bring all the raw materials from Earth.... I think this is more realistic and benign than the ... "terraforming"* of planets.' He maintains that colonised planets 'should be preserved with a status that is analogous to Antarctica here on Earth.'

On the question of using robots to colonise other planets and exploit mineral resources, engineering Professor Daniel Wolpert replied, 'I don't see a pressing need to colonise other planets unless we can bring [these] resources back to Earth. The vast majority of Earth is currently inaccessible to us. Using robots to gather resources nearer to home would seem to be a better use of our robotic tools.'

Meanwhile, for anthropology Professor Kathleen Richardson, the idea of 'colonisation' of other planets seemed morally dubious: 'I think whether we do something on Earth or on Mars we should always do it in the spirit of a genuine interest in "the Other", not to impose a particular model, but to meet "the Other".'

In response to the second question, 'How soon will machine intelligence outstrip human intelligence?', Rees mentions robots that are advanced enough to beat humans at chess, but then goes on to say, 'Robots are still limited in their ability to sense their environment: they can't yet recognise and move the pieces on a real chessboard as cleverly as a child can. Later this century, however, their more advanced successors may relate to their surroundings, and to people, as adeptly as we do. Moral questions then arise. ... Should we feel guilty about exploiting [sophisticated robots]? Should we fret if they are underemployed, frustrated, or bored?'

Wolpert's response to the question about machine intelligence outstripping human intelligence was this: 'In a limited sense it already has. Machines can already navigate, remember and search for items with an ability that far outstrips humans. However, there is no machine that can identify visual objects or speech with the reliability and flexibility of humans.... Expecting a machine close to the creative intelligence of a human within the next 50 years would be highly ambitious.'

Richardson believes that our fear of machines becoming too advanced has more to do with human nature than anything intrinsic to the machines themselves. In her view, it stems from humans' tendency to personify inanimate objects: we create machines based on representations of ourselves, imagine that machines think and behave as we do, and therefore see them as an autonomous threat. 'One of the consequences of thinking that the problem lies with machines is that we tend to imagine they are greater and more powerful than they really are and subsequently they become so.'

This led on to the third question, 'Should we be scared by advances in artificial intelligence?' To this question, Rees replied, 'Those who should be worried are the futurologists who believe in the so-called "singularity".** ... And another worry is that we are increasingly dependent on computer networks, and that these could behave like a single "brain" with a mind of its own, and with goals that may be contrary to human welfare. I think we should ensure that robots remain as no more than "idiot savants" lacking the capacity to outwit us, even though they may greatly surpass us in the ability to calculate and process information.'

Wolpert's response was to say that we have already seen the damaging effects of artificial intelligence in the form of computer viruses. 'But in this case,' he says, 'the real intelligence is the malicious designer. Critically, the benefits of computers outweigh the damage that computer viruses cause. Similarly, while there may be misuses of robotics in the near future, the benefits that they will bring are likely to outweigh these negative aspects.'

Richardson's response to this question was this: 'We need to ask why fears of artificial intelligence and robots persist; none have in fact risen up and challenged human supremacy.' She believes that as robots have never shown themselves to be a threat to humans, it seems unlikely that they ever will. In fact, she went on, 'Not all fear [robots]; many people welcome machine intelligence.'

In answer to the fourth question, What can science fiction tell us about robotics?', Rees replied, 'I sometimes advise students that it's better to read first-rate science fiction than second-rate science more stimulating, and perhaps no more likely to be wrong.'

As his response, Wolpert commented, 'Science fiction has often been remarkable at predicting the future. Science fiction has painted a vivid spectrum of possible futures, from cute and helpful robots to dystopian robotic societies. Interestingly, almost no science fiction envisages a future without robots.'

Finally, on the question of science fiction, Richardson pointed out that in modern society, people tend to think there is reality on the one hand, and fiction and fantasy on the other. She then explained that the division did not always exist, and that scientists and technologists made this separation because they wanted to carve out the sphere of their work. 'But the divide is not so clear cut, and that is why the worlds seem to collide at times,' she said. 'In some cases, we need to bring these different understandings together to get a whole perspective. Perhaps then, we won't be so frightened that something we create as a copy of ourselves will be a [threat] to us.'

*terraforming: modifying a planet's atmosphere to suit human needs
** singularity: the point when robots will be able to start creating ever more sophisticated versions of themselves`,
            },
        ],
        parts: {
            1: {
                blocks: [
                    {
                        type: "notes",
                        instruction: "Complete the notes below.",
                        instructionSub: "Choose ONE WORD ONLY from the passage for each answer.",
                        title: "The history of frozen food",
                        items: [
                            { qNum: 1, prefix: "2,000 years ago, South America: People conserved the nutritional value of ", suffix: ", using a method of freezing then drying." },
                            { qNum: 2, prefix: "1851, USA: ", suffix: " was kept cool by ice during transportation in specially adapted trains." },
                            { qNum: 3, prefix: "1880, Australia: Two kinds of ", suffix: " were the first frozen food shipped to England." },
                            { qNum: 4, prefix: "1917 onwards, USA: Clarence Birdseye introduced innovations including quick-freezing methods, so that ", suffix: " did not spoil the food." },
                            { qNum: 5, prefix: "1917 onwards, USA: packaging products with ", suffix: " so the product was visible." },
                            { qNum: 6, prefix: "Early 1940s, USA: Frozen food became popular because of a shortage of ", suffix: "" },
                            { qNum: 7, prefix: "1950s, USA: A large number of homes now had a ", suffix: "" },
                        ],
                    },
                    {
                        type: "trueFalseNg",
                        instruction: "Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.",
                        questions: [
                            { qNum: 8, text: "The ice transportation business made some Boston ship owners very wealthy in the early 1800s." },
                            { qNum: 9, text: "A disadvantage of the freezing process invented in Australia was that it affected the taste of food." },
                            { qNum: 10, text: "Clarence Birdseye travelled to Labrador in order to learn how the Inuit people froze fish." },
                            { qNum: 11, text: "Swanson Foods invested a great deal of money in the promotion of the TV Dinner." },
                            { qNum: 12, text: "Swanson Foods developed a new style of container for the launch of the TV Dinner." },
                            { qNum: 13, text: "The US frozen food industry is currently the largest in the world." },
                        ],
                    },
                ],
            },
            2: {
                blocks: [
                    {
                        type: "paragraphMatch",
                        instruction: "Reading Passage 2 has six sections, A-F. Choose the correct heading for each section from the list of headings below.",
                        letters: ["i", "ii", "iii", "iv", "v", "vi", "vii"],
                        headings: [
                            { letter: "i", text: "Tried and tested solutions" },
                            { letter: "ii", text: "Cooperation beneath the waves" },
                            { letter: "iii", text: "Working to lessen the problems" },
                            { letter: "iv", text: "Disagreement about the accuracy of a certain phrase" },
                            { letter: "v", text: "Two clear educational goals" },
                            { letter: "vi", text: "Promoting hope" },
                            { letter: "vii", text: "A warning of further trouble ahead" },
                        ],
                        items: [
                            { qNum: 14, text: "Section A" },
                            { qNum: 15, text: "Section B" },
                            { qNum: 16, text: "Section C" },
                            { qNum: 17, text: "Section D" },
                            { qNum: 18, text: "Section E" },
                            { qNum: 19, text: "Section F" },
                        ],
                    },
                    {
                        type: "paragraphMatch",
                        instruction: "Choose TWO letters, A-E. Which TWO of these causes of damage to coral reefs are mentioned by the writer of the text?",
                        letters: ["A", "B", "C", "D", "E"],
                        headings: [
                            { letter: "A", text: "a rising number of extreme storms" },
                            { letter: "B", text: "the removal of too many fish from the sea" },
                            { letter: "C", text: "the contamination of the sea from waste" },
                            { letter: "D", text: "increased disease among marine species" },
                            { letter: "E", text: "alterations in the usual flow of water in the seas" },
                        ],
                        items: [
                            { qNum: 20, text: "Answer 1" },
                            { qNum: 21, text: "Answer 2" },
                        ],
                    },
                    {
                        type: "paragraphMatch",
                        instruction: "Choose TWO letters, A-E. Which TWO of the following statements are true of the researchers at London Zoo?",
                        letters: ["A", "B", "C", "D", "E"],
                        headings: [
                            { letter: "A", text: "They are hoping to expand the numbers of different corals being bred in laboratories." },
                            { letter: "B", text: "They want to identify corals that can cope well with the changed sea conditions." },
                            { letter: "C", text: "They are looking at ways of creating artificial reefs that corals could grow on." },
                            { letter: "D", text: "They are trying out methods that would speed up reproduction in some corals." },
                            { letter: "E", text: "They are investigating materials that might protect reefs from higher temperatures." },
                        ],
                        items: [
                            { qNum: 22, text: "Answer 1" },
                            { qNum: 23, text: "Answer 2" },
                        ],
                    },
                    {
                        type: "sentenceCompletion",
                        instruction: "Complete the sentences below.",
                        instructionSub: "Choose ONE WORD ONLY from the passage for each answer.",
                        items: [
                            { qNum: 24, textBefore: "Corals have a number of ", textAfter: " which they use to collect their food." },
                            { qNum: 25, textBefore: "Algae gain ", textAfter: " from being inside the coral." },
                            { qNum: 26, textBefore: "Increases in the warmth of the sea water can remove the ", textAfter: " from coral." },
                        ],
                    },
                ],
            },
            3: {
                blocks: [
                    {
                        type: "matchPerson",
                        instruction: "Look at the following statements (27-33) and the list of experts below. Match each statement with the correct expert, A, B, or C. NB You may use any letter more than once.",
                        people: [
                            { letter: "A", name: "Martin Rees" },
                            { letter: "B", name: "Daniel Wolpert" },
                            { letter: "C", name: "Kathleen Richardson" },
                        ],
                        items: [
                            { qNum: 27, text: "For our own safety, humans will need to restrict the abilities of robots." },
                            { qNum: 28, text: "The risk of robots harming us is less serious than humans believe it to be." },
                            { qNum: 29, text: "It will take many decades for robot intelligence to be as imaginative as human intelligence." },
                            { qNum: 30, text: "We may have to start considering whether we are treating robots fairly." },
                            { qNum: 31, text: "Robots are probably of more help to us on Earth than in space." },
                            { qNum: 32, text: "The ideas in high-quality science fiction may prove to be just as accurate as those found in the work of mediocre scientists." },
                            { qNum: 33, text: "There are those who look forward to robots developing greater intelligence." },
                        ],
                    },
                    {
                        type: "matchPerson",
                        instruction: "Complete each sentence with the correct ending, A-D, below.",
                        listLabel: "List of Endings",
                        people: [
                            { letter: "A", name: "robots to explore outer space." },
                            { letter: "B", name: "advances made in machine intelligence so far." },
                            { letter: "C", name: "changes made to other planets for our own benefit." },
                            { letter: "D", name: "the harm already done by artificial intelligence." },
                        ],
                        items: [
                            { qNum: 34, text: "Richardson and Rees express similar views regarding the ethical aspect of" },
                            { qNum: 35, text: "Rees and Wolpert share an opinion about the extent of" },
                            { qNum: 36, text: "Wolpert disagrees with Richardson on the question of" },
                        ],
                    },
                    {
                        type: "multipleChoice",
                        instruction: "Choose the correct letter, A, B, C or D.",
                        questions: [
                            { qNum: 37, text: "What point does Richardson make about fear of machines?", options: [
                                    { letter: "A", text: "It has grown alongside the development of ever more advanced robots." },
                                    { letter: "B", text: "It is the result of our inclination to attribute human characteristics to non-human entities." },
                                    { letter: "C", text: "It has its origins in basic misunderstandings about how inanimate objects function." },
                                    { letter: "D", text: "It demonstrates a key difference between human intelligence and machine intelligence." },
                                ] },
                            { qNum: 38, text: "What potential advance does Rees see as a cause for concern?", options: [
                                    { letter: "A", text: "robots outnumbering people" },
                                    { letter: "B", text: "robots having abilities which humans do not" },
                                    { letter: "C", text: "artificial intelligence developing independent thought" },
                                    { letter: "D", text: "artificial intelligence taking over every aspect of our lives" },
                                ] },
                            { qNum: 39, text: "What does Wolpert emphasise in his response to the question about science fiction?", options: [
                                    { letter: "A", text: "how science fiction influences our attitudes to robots" },
                                    { letter: "B", text: "how fundamental robots are to the science fiction genre" },
                                    { letter: "C", text: "how the image of robots in science fiction has changed over time" },
                                    { letter: "D", text: "how reactions to similar portrayals of robots in science fiction may vary" },
                                ] },
                            { qNum: 40, text: "What is Richardson doing in her comment about reality and fantasy?", options: [
                                    { letter: "A", text: "warning people not to confuse one with the other" },
                                    { letter: "B", text: "outlining ways in which one has impacted on the other" },
                                    { letter: "C", text: "recommending a change of approach in how people view them" },
                                    { letter: "D", text: "explaining why scientists have a different perspective on them from other people" },
                                ] },
                        ],
                    },
                ],
            },
        },
    },
    "cambridge-20|test-4": {
        passages: [
            {
                part: 1,
                title: "Georgia O'Keeffe",
                content: `For seven decades, Georgia O'Keeffe (1887-1986) was a major figure in American art. Remarkably, she remained independent from shifting art trends and her work stayed true to her own vision, which was based on finding the essential, abstract forms in nature. With exceptionally keen powers of observation and great finesse with a paintbrush, she recorded subtle nuances of colour, shape, and light that enlivened her paintings and attracted a wide audience.

Born in 1887 near Sun Prairie, Wisconsin to cattle breeders Francis and Ida O'Keeffe, Georgia was raised on their farm along with her six siblings. By the time she graduated from high school in 1905, she had determined to make her way as an artist. She studied the techniques of traditional painting at the Art Institute of Chicago school (1905) and the Art Students League of New York (1907-8). After attending university and then training college, she became an art teacher and taught in elementary schools, high schools, and colleges in Virginia, Texas, and South Carolina from 1911 to 1918.

During this period, O'Keeffe began to experiment with creating abstract compositions in charcoal, and produced a series of innovative drawings that led her art in a new direction. She sent some of these drawings to a friend in New York, who showed them to art collector and photographer Alfred Stieglitz in January 1916. Stieglitz was impressed, and exhibited the drawings later that year at his gallery on Fifth Avenue, New York City, where the works of many avant-garde artists and photographers were introduced to the American public.

With Stieglitz's encouragement and promise of financial support, O'Keeffe arrived in New York in June 1918 to begin a career as an artist. For the next three decades, Stieglitz vigorously promoted her work in twenty-two solo exhibitions and numerous group installations. The two were married in 1924. The ups and downs of their personal and professional relationship were recorded in Stieglitz's celebrated black-and-white portraits of O'Keeffe, taken over the course of twenty years (1917-37).

By the mid-1920s, O'Keeffe was recognized as one of America's most important and successful artists, widely known for the architectural pictures that dramatically depict the soaring skyscrapers of New York. But most often, she painted botanical subjects, inspired by annual trips to the Stieglitz family summer home. In her magnified images depicting flowers, begun in 1924, O'Keeffe brings the viewer right into the picture.

Enlarging the tiniest details to fill an entire metre-wide canvas emphasized their shapes and lines and made them appear abstract. Such daring compositions helped establish O'Keeffe's reputation as an innovative modernist.

In 1929, O'Keeffe made her first extended trip to the state of New Mexico. It was a visit that had a lasting impact on her life, and an immediate effect on her work. Over the next two decades she made almost annual trips to New Mexico, staying up to six months there, painting in relative solitude, then returning to New York each winter to exhibit the new work at Stieglitz's gallery. This pattern continued until she moved permanently to New Mexico in 1949.

There, O'Keeffe found new inspiration: at first, it was the numerous sun-bleached bones she came across in the state's rugged terrain that sparked her imagination. Two of her earliest and most celebrated Southwestern paintings exquisitely reproduce a cow skull's weathered surfaces, jagged edges, and irregular openings. Later, she also explored another variation on this theme in her large series of Pelvis pictures, which focused on the contrasts between convex and concave surfaces, and solid and open spaces.

However, it was the region's spectacular landscape, with its unusual geological formations, vivid colours, clarity of light, and exotic vegetation, that held the artist's imagination for more than four decades. Often, she painted the rocks, cliffs, and mountains in striking close-up, just as she had done with her botanical subjects.

O'Keeffe eventually owned two homes in New Mexico – the first, her summer retreat at Ghost Ranch, was nestled beneath 200-metre cliffs, while the second, used as her winter residence, was in the small town of Abiquiú. While both locales provided a wealth of imagery for her paintings, one feature of the Abiquiú house – the large walled patio with its black door – was particularly inspirational. In more than thirty pictures between 1946 and 1960, she reinvented the patio into an abstract arrangement of geometric shapes.

From the 1950s into the 1970s, O'Keeffe travelled widely, making trips to Asia, the Middle East, and Europe. Flying in planes inspired her last two major series – aerial views of rivers and expansive paintings of the sky viewed from just above clouds. In both series, O'Keeffe increased the size of her canvases, sometimes to mural proportions, reflecting perhaps her newly expanded view of the world. When in 1965 she successfully translated one of her cloud motifs to a monumental canvas measuring 6 metres in length (with the help of assistants), it was an enormous challenge and a special feat for an artist nearing eighty years of age.

The last two decades of the artist's life were relatively unproductive as ill health and blindness hindered her ability to work. O'Keeffe died in 1986 at the age of ninety-eight, but her rich legacy of some 900 paintings has continued to attract subsequent generations of artists and art lovers who derive inspiration from these very American images.`,
            },
            {
                part: 2,
                title: "Adapting to the effects of climate change",
                content: `A. All around the world, nations are already preparing for, and adapting to, climate change and its impacts. Even if we stopped all CO2 emissions tomorrow, we would continue to see the impact of the CO2 already released since industrial times, with scientists forecasting that global warming would continue for around 40 years. In the meantime, ice caps would continue to melt and sea levels rise. Some countries and regions will suffer more extreme impacts from these changes than others. It's in these places that innovation is thriving.

B. In Miami Beach, Florida, USA, seawater isn't just breaching the island city's walls, it's seeping up through the ground, so the only way to save the city is to lift it up above sea level. Starting in the lowest and most vulnerable neighbourhoods, roads have been raised by as much as 61 centimetres. The elevation work was carried out as part of Miami Beach's ambitious but much-needed stormwater-management programme. In addition to the road adaptations, the city has set up new pumps that can remove up to 75,000 litres of water per minute. In the face of floods, climate-mitigation strategies have often been overlooked, says Yanira Pineda, a senior sustainability coordinator. She knows that they're essential and that the job is far from over. 'We know that in 20, 30, 40 years, we'll need to go back in there and adjust to the changing environment,' she says.

C. Seawalls are a staple strategy for many coastal communities, but on the soft, muddy northern shores of Java, Indonesia, they frequently collapse, further exacerbating coastal erosion. There have been many attempts to restore the island's coastal mangroves: ecosystems of trees and shrubs that help defend coastal areas by trapping sediment in their net-like root systems, elevating the sea bed and dampening the energy of waves and tidal currents. But Susanna Tol of the not-for-profit organisation Wetlands International says that, while hugely popular, the majority of mangrove-planting projects fail. So, Wetlands International started out with a different approach, building semi-permeable dams, made from bamboo poles and brushwood, to mimic the role of mangrove roots and create favourable conditions for mangroves to grow back naturally. The programme has seen moderate success, mainly in areas with less subsidence. "Unfortunately, traditional infrastructure is often single-solution focused,' says Tol. 'For long-term success, it's critical that we transition towards multifunctional approaches that embed natural processes and that engage and benefit communities and local decision-makers."

D. As the floodwaters rose in the rice fields of the Mekong Delta in September 2018, four small houses rose with them. Homes in this part of Vietnam are traditionally built on stilts but these ones had been built to float. The modifications were made by the Buoyant Foundation Project, a not-for-profit organisation that has been researching and retrofitting amphibious houses since 2006. 'When I started this,' explains founder Elizabeth English, 'climate change was not on the tip of everybody's tongue,' but this technology is becoming necessary in places that didn't previously need it. It's much cheaper than permanently elevating houses, English explains – about a third of what it would cost to completely replace a building's foundations. It also avoids the problem of taller houses being at greater risk from wind damage. Another plus comes from the fact that amphibious structures can be sensitively adapted to meet cultural needs and match the kind of houses that are already common in a community.

E. Bangladesh is especially vulnerable to climate change. Most of the country is less than a metre above sea level and 80 per cent of its land lies on floodplains. 'Almost 35 million people living on the coastal belt of Bangladesh are currently affected by soil and water salinity,' says Raisa Chowdhury of the international development organisation ICCO Cooperation. Rather than fighting against it, one project is helping communities adapt to salt-affected soils. ICCO Cooperation has been working with 10,000 farmers in Bangladesh to start cultivating naturally salt-tolerant crops in the region. Certain varieties of carrot, potato, kohlrabi, cabbage and beetroot have been found to be better suited to salty soil than the rice and wheat that is typically grown there. Chowdhury says that the results are very visible, comparing a barren plot of land to the 'beautiful, lush green vegetable garden' sitting beside it, in which he and his team have been working with the farmers. Since the project began, farmers trained in saline agriculture have reported increases of two to three more harvests per year.

F. Greg Spotts from Los Angeles (LA) in the USA is chief sustainability officer of the city's street services department. He leads the Cool Streets LA programme, a series of pilot projects, which include the planting of trees and the installation of a 'cool pavement' system, designed to help reach the city's goal of bringing down its average temperature by 1.5°C. 'Urban cooling is literally a matter of life and death for our future in LA,' says Spotts. Using a Geographic Information System data mapping tool, the programme identified streets with low tree canopy cover in three of the city's neighbourhoods and covered them with a light-grey, light-reflecting coating, which had already been shown to lower road surface temperature in Los Angeles by 6°C. Spotts says one of these streets, in the Winnetka neighbourhood of San Fernando Valley, can now be seen as a pale crescent, the only cool spot on an otherwise red thermal image, from the International Space Station.`,
            },
            {
                part: 3,
                title: "A new role for livestock guard dogs",
                content: `Livestock guard dogs, traditionally used to protect farm animals from predators, are now being used to protect the predators themselves

A. For thousands of years, livestock guard dogs worked alongside shepherds to protect their sheep, goats and cattle from predators such as wolves and bears. But in the 19th and 20th centuries, when such predators were largely exterminated, most guard dogs lost their jobs. In recent years, however, as increased efforts have been made to protect wild animals, predators have become more widespread again. As a result, farmers once more need to protect their livestock, and guard dogs are enjoying an unexpected revival.

B. Today there are around 50 breeds of guard dogs on duty in various parts of the world. These dogs are raised from an early age with the animals they will be watching and eventually these animals become the dog's family. The dogs will place themselves between the livestock and any threat, barking loudly. If necessary, they will chase away predators, but often their mere presence is sufficient. 'Their initial training is to make them understand that livestock is going to be their life,' says Dan Macon, a shepherd with three guard dogs. 'A fluffy white puppy is fun to be around, but too much human affection makes it a great dog for guarding the front porch, rather than a great livestock guard dog.'

C. The evidence indicates that guard dogs are highly effective. For example, in Portugal, biologist Silvia Ribeiro has found that more than 90 per cent of the farmers participating in a programme to train and use guard dogs to protect their herds against attack from wolves rate the performance of the dogs as very good or excellent. In a study carried out in Australia by Linda van Bommel and Chris Johnson at the University of Tasmania, more than 65 per cent of herders reported that predation stopped completely after they got the dogs, and almost all the rest saw a decrease in attacks. 'If they are managed and used properly, livestock guard dogs are the most efficient control method that we have in terms of the amount of livestock that they save from predation,' says van Bommel.

D. But today's guard dogs also have a new role – to help preserve the predators. It is hoped that reductions in livestock losses can make farmers more tolerant of predators and less likely to kill them. In Namibia, more than 90 per cent of cheetahs live outside protected areas, close to humans raising livestock. As a result, the cheetahs are often held responsible for animal losses, and large numbers have been killed by farmers. When guard dogs were introduced, more than 90 per cent of farmers reported a dramatic reduction in livestock losses, and said that as a result they were less likely to kill predators. Julie Young, at Utah State University in the US, believes this result applies widely. "There is common ground from the livestock perspective and from the conservation perspective,' she says. 'If ranchers don't have a dead cow, they will not make a call to apply for a permit to kill a wolf.'

E. Looking at all the published evidence, Bethany Smith at Nottingham Trent University in the UK found that up to 88 per cent of farmers said they no longer killed predators after using dogs – but warned that such self-reported results must be taken with a pinch of salt. What's more, it is possible that livestock guard dogs merely displace predators to unprotected neighbouring properties, where their fate isn't recorded. 'In some regions, we work with almost every farmer, but in others only one or two have dogs,' says Ribeiro. 'If we are not working with everybody, we are transferring the wolf pressure to the neighbour's herd and he can use poison and kill an entire pack of wolves.'

F. Another concern is whether there may be unintended ecological effects of using guard dogs. Studies suggest that reducing deaths of one type of predator may have a negative impact on other species. The extent of this problem isn't known, but the consequences are clear in Namibia. Cheetahs aren't the only species that cause sheep and goat losses there: other predators also attack livestock. In 2015, researchers reported that in spite of the impact farmers obtaining guard dogs had on cheetahs, the number of jackals killed by dogs and people actually increased. Guard dogs have other ecological impacts too. They have been found to spread diseases to wild animals, including endangered Ethiopian wolves. They may also compete with other carnivores for food. And by creating a 'landscape of fear', their mere presence can influence the behaviour of prey animals.

G. The evidence so far, however, indicates that these consequences aren't always negative. Guard dogs can deliver unexpected benefits by protecting vulnerable wildlife from predators. For example, their presence has been found to protect birds which build their nests on the ground in fields, where foxes would normally raid them. Indeed, Australian researchers are now using dogs to enhance biodiversity and create refuges for species threatened by predation. So if we can get this right, there may be a bright future for guard dogs in promoting harmonious coexistence between humans and wildlife.`,
            },
        ],
        parts: {
            1: {
                blocks: [
                    {
                        type: "notes",
                        instruction: "Complete the notes below.",
                        instructionSub: "Choose ONE WORD ONLY from the passage for each answer.",
                        title: "The Life and Work of Georgia O'Keeffe",
                        items: [
                            { qNum: 1, prefix: "– studied art, then worked as a ", suffix: " in various places in the USA" },
                            { qNum: 2, prefix: "– created drawings using ", suffix: " which were exhibited in New York City" },
                            { qNum: 3, prefix: "– moved to New York and became famous for her paintings of the city's ", suffix: "" },
                            { qNum: 4, prefix: "– produced a series of innovative close-up paintings of ", suffix: "" },
                            { qNum: 5, prefix: "– went to New Mexico and was initially inspired to paint the many ", suffix: " that could be found there" },
                            { qNum: 6, prefix: "– continued to paint various features that together formed the dramatic ", suffix: " of New Mexico for over forty years" },
                            { qNum: 7, prefix: "– travelled widely by plane in later years, and painted pictures of clouds and ", suffix: " seen from above." },
                        ],
                    },
                    {
                        type: "trueFalseNg",
                        instruction: "Do the following statements agree with the information given in Reading Passage? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.",
                        questions: [
                            { qNum: 8, text: "Georgia O'Keeffe's style was greatly influenced by the changing fashions in art over the seven decades of her career." },
                            { qNum: 9, text: "When O'Keeffe finished high school, she had already made her mind up about the career that she wanted." },
                            { qNum: 10, text: "Alfred Stieglitz first discovered O'Keeffe's work when she sent some abstract drawings to his gallery in New York City." },
                            { qNum: 11, text: "O'Keeffe was the subject of Stieglitz's photographic work for many years." },
                            { qNum: 12, text: "O'Keeffe's paintings of the patio of her house in Abiquiu were among the artist's favourite works." },
                            { qNum: 13, text: "O'Keeffe produced a greater quantity of work during the 1950s to 1970s than at any other time in her life." },
                        ],
                    },
                ],
            },
            2: {
                blocks: [
                    {
                        type: "paragraphMatch",
                        instruction: "Reading Passage has six paragraphs, A–F. Which paragraph contains the following information? Write the correct letter, A–F.",
                        letters: ["A", "B", "C", "D", "E", "F"],
                        items: [
                            { qNum: 14, text: "how a type of plant functions as a natural protection for coastlines" },
                            { qNum: 15, text: "a prediction about how long it could take to stop noticing the effects of climate change" },
                            { qNum: 16, text: "a reference to the fact that a solution is particularly cost-effective" },
                            { qNum: 17, text: "a mention of a technology used to locate areas most in need of intervention" },
                        ],
                    },
                    {
                        type: "sentenceCompletion",
                        instruction: "Complete the sentences below.",
                        instructionSub: "Choose ONE WORD ONLY from the passage for each answer.",
                        items: [
                            { qNum: 18, textBefore: "The stormwater-management programme in Miami Beach has involved the installation of efficient ", textAfter: "" },
                            { qNum: 19, textBefore: "The construction of ", textAfter: " was the first stage of a project to ensure the success of mangroves in Indonesia." },
                            { qNum: 20, textBefore: "As a response to rising floodwaters in the Mekong Delta, a not-for-profit organisation has been building houses that can ", textAfter: "." },
                            { qNum: 21, textBefore: "Rising sea levels in Bangladesh have made it necessary to introduce various ", textAfter: " that are suitable for areas of high salt content." },
                            { qNum: 22, textBefore: "A project in LA has increased the number of ", textAfter: " on the city's streets." },
                        ],
                    },
                    {
                        type: "matchPerson",
                        instruction: "Match each statement with the correct person. Write the correct letter, A–E.",
                        people: [
                            { letter: "A", name: "Yanira Pineda" },
                            { letter: "B", name: "Susanna Tol" },
                            { letter: "C", name: "Elizabeth English" },
                            { letter: "D", name: "Raisa Chowdhury" },
                            { letter: "E", name: "Greg Spotts" },
                        ],
                        items: [
                            { qNum: 23, text: "It is essential to adopt strategies which involve and help residents of the region." },
                            { qNum: 24, text: "Interventions which reduce heat are absolutely vital for our survival in this location." },
                            { qNum: 25, text: "More work will need to be done in future decades to deal with the impact of rising water levels." },
                            { qNum: 26, text: "The number of locations requiring action to adapt to flooding has grown in recent years." },
                        ],
                    },
                ],
            },
            3: {
                blocks: [
                    {
                        type: "paragraphMatch",
                        instruction: "Which paragraph contains the following information? Write the correct letter, A–G. NB You may use any letter more than once.",
                        letters: ["A", "B", "C", "D", "E", "F", "G"],
                        items: [
                            { qNum: 27, text: "An example of how one predator has been protected by the introduction of livestock guard dogs" },
                            { qNum: 28, text: "An optimistic suggestion about the possible positive developments in the use of livestock guard dogs" },
                            { qNum: 29, text: "A description of how the methods used by livestock guard dogs help to keep predators away" },
                            { qNum: 30, text: "Claims by different academics that the use of livestock guard dogs is a successful way of protecting farmers' herds" },
                            { qNum: 31, text: "A reference to how livestock guard dogs gain their skills" },
                        ],
                    },
                    {
                        type: "matchPerson",
                        instruction: "Match each statement with the correct person. Write the correct letter, A–E.",
                        people: [
                            { letter: "A", name: "Dan Macon" },
                            { letter: "B", name: "Silvia Ribeiro" },
                            { letter: "C", name: "Linda van Bommel" },
                            { letter: "D", name: "Julie Young" },
                            { letter: "E", name: "Bethany Smith" },
                        ],
                        items: [
                            { qNum: 32, text: "The use of guard dogs may save the lives of both livestock and wild animals." },
                            { qNum: 33, text: "Claims of a change in behaviour from those using livestock guard dogs may not be totally accurate." },
                            { qNum: 34, text: "There may be negative results if the use of livestock guard dogs is not sufficiently widespread." },
                            { qNum: 35, text: "Livestock guard dogs are the best way of protecting farm animals, as long as the dogs are appropriately handled." },
                            { qNum: 36, text: "Teaching a livestock guard dog how to do its work needs a different focus from teaching a house guard dog." },
                        ],
                    },
                    {
                        type: "summary",
                        instruction: "Complete the summary below.",
                        instructionSub: "Choose ONE WORD ONLY from the passage for each answer.",
                        title: "Unintended Ecological Effects of Using Guard Dogs",
                        items: [
                            { qNum: 37, prefix: "In Namibia, livestock guard dogs have been used to protect domestic animals from attacks by cheetahs. This has led to a rise in the deaths of other predators, particularly ", suffix: "." },
                            { qNum: 38, prefix: "In addition, it has been suggested that the dogs could have ", suffix: " which may affect other species" },
                            { qNum: 39, prefix: "and that they may reduce the amount of ", suffix: " available to certain wild animals." },
                            { qNum: 40, prefix: "On the other hand, these dogs may help birds by protecting their nests. These might otherwise be threatened by predators such as ", suffix: "." },
                        ],
                    },
                ],
            },
        },
    },
};
import { engnovateReadingContent } from "./engnovate-reading-generated/content";
export function hasTestContent(setId: string, testId: string): boolean {
    const key = `${setId}|${testId}`;
    return key in contentByTest || key in engnovateReadingContent;
}
export function getReadingContent(setId: string, testId: string): ReadingContentMap | null {
    const key = `${setId}|${testId}`;
    const content = contentByTest[key] ?? engnovateReadingContent[key];
    return content ? (content as ReadingContentMap) : null;
}
