package reversedict;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Iterator;

import edu.mit.jwi.Dictionary;
import edu.mit.jwi.IDictionary;
import edu.mit.jwi.RAMDictionary;
import edu.mit.jwi.data.ILoadPolicy;
import edu.mit.jwi.item.IIndexWord;
import edu.mit.jwi.item.IWord;
import edu.mit.jwi.item.IWordID;
import edu.mit.jwi.item.POS;

public class ReverseDictionary {
	private static IDictionary dict;
	
	public ReverseDictionary() throws Exception {
		//String path = String.format("src/main/resources/WordNet-3.0/dict", new File("").getAbsolutePath());
		String path = "src/main/resources/WordNet-3.0/dict";
		URL pathToFile = new URL("file", null, path);
		// construct the url to the Wordnet dictionary directory
		//URL pathToFile = this.getClass().getClassLoader().getResource("resources/WordNet-3.0/dict");
		System.out.print("Creating WordNet dict...");
		long t = System.currentTimeMillis();
		dict = new Dictionary(pathToFile);
		System.out.printf("done creating (%1d msec)\n", System.currentTimeMillis()-t);
		t = System.currentTimeMillis();
		dict.open();
		System.out.printf("done opening (%1d msec)\n", System.currentTimeMillis()-t);
		// construct the dictionary object and open it
		
		/**dict = new RAMDictionary(pathToFile, ILoadPolicy.NO_LOAD);
		dict.open();
		
		// done slowly
		trek(dict);
		
		// load into memory
		System.out.print("\nLoading Wordnet into memory...");
		long t = System.currentTimeMillis();
		((RAMDictionary) dict).load(true);
		System.out.printf("done (%1d msec)\n", System.currentTimeMillis()-t);
		
		// done quickers
		trek(dict);
		
		System.out.print("Loading dictionary data...");
		long t = System.currentTimeMillis();
		dict = new RAMDictionary(pathToFile);
		((RAMDictionary) dict).setLoadPolicy(ILoadPolicy.IMMEDIATE_LOAD);
		dict.open();
		t = System.currentTimeMillis()-t;
		System.out.printf("done (%1d sec, args)\n", t/1000);
		
		File exFile = File.createTempFile("JWI_Export_", ".wn");
		exFile.deleteOnExit();
		
		System.out.print("Exporting dictionary data...");
		t = System.currentTimeMillis();
		((RAMDictionary) dict).export(new FileOutputStream(exFile));
		dict.close();
		t = System.currentTimeMillis()-t;
		System.out.printf("done (%1d sec)\n", t/1000);
		
		System.out.printf("Export is %1d MB\n", exFile.length()/1048576);
		
		System.out.print("Loading from exported data...");
		t = System.currentTimeMillis();
		dict = new RAMDictionary(exFile);
		dict.open();
		t = System.currentTimeMillis()-t;
		System.out.printf("done (%1d sec)\n", t/1000);
		
		trek(dict);*/
	}
	public void trek(IDictionary dict) {
		int tickNext = 0;
		int tickSize = 20000;
		int seen = 0;
		System.out.print("Treking across Wordnet");
		long t = System.currentTimeMillis();
		for (POS pos : POS.values())
			for (Iterator<IIndexWord> i = dict.getIndexWordIterator(pos); 
					i.hasNext(); )
				for (IWordID wid : i.next().getWordIDs()) {
					seen += dict.getWord(wid).getSynset().getWords().size();
					if (seen > tickNext) {
						System.out.print(',');
						tickNext = seen + tickSize;
					}
				}
		System.out.printf("done (%1d msec)\n", System.currentTimeMillis()-t);
		System.out.printf("In my trek I saw " + seen + "words");
	}
	public String findRelativePath() {
		IIndexWord idxWord = dict.getIndexWord("dog", POS.NOUN);
		IWordID wordID = idxWord.getWordIDs().get(0);
		IWord word = dict.getWord(wordID);
		System.out.println("Id = " + wordID);
		System.out.println("Lemma = " + word.getLemma());
		System.out.println("Gloss = " + word.getSynset().getGloss());
		return word.getSynset().getGloss();
	}

	public static void main(String args[]) throws Exception {
		// check if terms being queried have been queried before
		// possibly a properties file
		ReverseDictionary dict;
		dict = new ReverseDictionary();
		//dict.findRelativePath();
	}
}
