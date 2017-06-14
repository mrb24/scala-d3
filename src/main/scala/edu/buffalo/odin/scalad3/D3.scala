package edu.buffalo.odin.scalad3

import java.io.{File, FileOutputStream, FileInputStream, FileNotFoundException, IOException, Reader, InputStreamReader}

import org.apache.commons.logging.{Log, LogFactory}
import org.mozilla.javascript.{Context, Scriptable, ScriptableObject, Callable}
import org.mozilla.javascript.tools.shell.Global

import com.google.common.base.Charsets;

import java.nio.file.{Paths, Files, Path}
import java.nio.charset.StandardCharsets

import org.apache.batik.transcoder.image.PNGTranscoder
import org.apache.batik.transcoder.{TranscoderInput, TranscoderOutput}
import org.apache.fop.svg.PDFTranscoder

object D3 {
  val LOG = LogFactory.getLog("edu.buffalo.odin.scalad3.D3")
  val JS_VERSION = Context.VERSION_1_8;
  val OPTIMIZATION_LEVEL = -1;
    
  var ENVIRONMENT = createNewEnvironment()
  
  def main(args: Array[String])  {
    val cx = Context.enter();
    try {
       cx.setOptimizationLevel(OPTIMIZATION_LEVEL);
       cx.setLanguageVersion(JS_VERSION);
        
       //bar(cx) 
       //sortBar(cx)
       groupedBar(cx)
        
    } catch {
      case t: Throwable => t.printStackTrace() // TODO: handle error
    }
    finally {
        Context.exit();
    }
  }
  
  
  def sortBar(cx:Context) = {
    val scope = getScope(cx);
    var dataJsonStr = "["
    for(i <- 1 to 15){
      if(i>1)
        dataJsonStr += ","
      dataJsonStr += s"""{"letter":"${i.toString}", "frequency":"${Math.random().toString}"}"""
    }
    dataJsonStr += "]"
    val nativeJsonObject= org.mozilla.javascript.NativeJSON.parse(cx,scope,dataJsonStr,new NullCallable());
    scope.put("scdata", scope, nativeJsonObject);
    loadJS(cx, scope, "js/graph.js")
  }
  
  def bar(cx:Context) = {
    val scope = getScope(cx);
    var dataJsonStr = "["
    for(i <- 1 to 15){
      if(i>1)
        dataJsonStr += ","
      dataJsonStr += s"""{"letter":"${i.toString}", "frequency":"${Math.random().toString}"}"""
    }
    dataJsonStr += "]"
    val nativeJsonObject= org.mozilla.javascript.NativeJSON.parse(cx,scope,dataJsonStr,new NullCallable());
    scope.put("scdata", scope, nativeJsonObject);
    loadJS(cx, scope, "js/bar_graph.js")
  }
  
  def groupedBar(cx:Context) = {
    val scope = getScope(cx);
    var datacsv = s"""State,Under 5 Years,5 to 13 Years,14 to 17 Years,18 to 24 Years,25 to 44 Years,45 to 64 Years,65 Years and Over
CA,${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt}
TX,${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt}
NY,${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt}
FL,${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt}
IL,${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt}
PA,${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*10000000).toInt},${(Math.random()*5000000).toInt},${(Math.random()*5000000).toInt},${(Math.random()*5000000).toInt},${(Math.random()*5000000).toInt}"""
    scope.put("csvdata", scope, datacsv);
    loadJS(cx, scope, "js/grouped_bar.js")
  }
  
  
  def outputSVG(svg:String){
    Files.write(Paths.get("svg.svg"), svg.getBytes(StandardCharsets.UTF_8))
    val htmlFile = new File("svg.svg");
    java.awt.Desktop.getDesktop().browse(htmlFile.toURI());
  }
  
  def outputHTML(html:String){
    Files.write(Paths.get("html.html"), html.getBytes(StandardCharsets.UTF_8))
    val htmlFile = new File("html.html");
    java.awt.Desktop.getDesktop().browse(htmlFile.toURI());
  }
  
  def outputPNG( svg:String){
    Files.write(Paths.get("svg.svg"), svg.getBytes(StandardCharsets.UTF_8))
    val svg_URI_input = Paths.get("svg.svg").toUri().toURL().toString();
    val input_svg_image = new TranscoderInput(svg_URI_input);        
    //Step-2: Define OutputStream to PNG Image and attach to TranscoderOutput
    val png_ostream = new FileOutputStream("png.png");
    val output_png_image = new TranscoderOutput(png_ostream);              
    // Step-3: Create PNGTranscoder and define hints if required
    val my_converter = new PNGTranscoder();        
    // Step-4: Convert and Write output
    my_converter.transcode(input_svg_image, output_png_image);
    // Step 5- close / flush Output Stream
    png_ostream.flush();
    png_ostream.close();        
    val pngFile = new File("png.png");
    java.awt.Desktop.getDesktop().browse(pngFile.toURI());
  }
  
  def outputPDF(svg:String){
    Files.write(Paths.get("svg.svg"), svg.getBytes(StandardCharsets.UTF_8))
    val svg_URI_input = Paths.get("svg.svg").toUri().toURL().toString();
    val input_svg_image = new TranscoderInput(svg_URI_input);        
    //Step-2: Define OutputStream to PDF file and attach to TranscoderOutput
    val pdf_ostream = new FileOutputStream("pdf.pdf");
    val output_pdf_file = new TranscoderOutput(pdf_ostream);               
    // Step-3: Create a PDF Transcoder and define hints
    val transcoder = new PDFTranscoder();
    // Step-4: Write output to PDF format
    transcoder.transcode(input_svg_image, output_pdf_file);
    // Step 5- close / flush Output Stream
    pdf_ostream.flush();
    pdf_ostream.close();
    val pdfFile = new File("pdf.pdf");
    java.awt.Desktop.getDesktop().browse(pdfFile.toURI());
  }
  
  def createNewEnvironment() : ScriptableObject = {
        var global:Global = null;
        
        val cx = Context.enter();
        try {
            cx.setOptimizationLevel(OPTIMIZATION_LEVEL);
            cx.setLanguageVersion(JS_VERSION);
            
            global = new Global();
            global.setSealedStdLib(true);
            global.init(cx);

            val argsObj = cx.newArray(global, Array[Object]());
            global.defineProperty("arguments", argsObj, ScriptableObject.DONTENUM);
            
            // Enable RequireJS
            loadJS(cx, global, "js/r.js");

            // Load the bootstrap file
            loadJS(cx, global, "js/bootstrap.js");
            
            global.sealObject();
        } catch {
          case e: Throwable => LOG.error("Error setting up Javascript environment", e);
        }
        finally {
            Context.exit();
        }
        global;
    }
    
    def loadJS( cx:Context,  scr:Scriptable,  fileName:String) = {
        var reader:Reader = null;
        try {
            reader = new InputStreamReader(new FileInputStream(new File(fileName)), Charsets.UTF_8);
        } catch {
          case e:FileNotFoundException =>
            throw new Exception("Could not find file", e);
        };
        
        try {
            cx.evaluateReader(scr, reader, fileName, 0, null);
        } catch {
          case e: Throwable => throw new Exception("IO error reading file", e);
        }
        finally {
            try { reader.close(); } catch {
              case e: Throwable =>
                throw new Exception("IO error closing file", e);
            }
        }
    }
    
    def  getScope( cx:Context) : Scriptable = {
        val scope = cx.newObject(ENVIRONMENT);
        scope.setPrototype(ENVIRONMENT);
        scope.setParentScope(null);
        scope;
    }
}

class NullCallable extends Callable
{
    def call( context:Context,  scope:Scriptable,  holdable:Scriptable,  objects:Array[Object]) : Object = 
    {
        objects(1);
    }
}

