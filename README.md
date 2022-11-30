# Autocheck-Solutions



                                                   Part 1:
                                                   
   #1 Theory: 
  
tag syntax-  A tag is a way to highlight content using special characters. A paired tag consists of a start tag, content, and an end tag
                                                                                                  
                                                   
Task-  Wrap the text in the h1 tag.

The main theme of the web page in the h1 header.           
______________________________________________________________________________________________________________________                            
                                                   
                                                   
  #2  Theory:
 
 HTML COMMENT SYNTAX

<!--  open the comment tag
    This is a comment in the HTML code 
close the comment tag --> 
  
  
  
  Task-
  
   Write html comment with text The commentary answers the question "Why is this part of the code written".
  ______________________________________________________________________________________________________________________
                                              
                                           
                                                   
                                                   
 #3 Theory:
 
 TAG ATTRIBUTES.

tag syntax with attribute

TAG ATTRIBUTES ARE REQUIRED AND OPTIONAL.

Tags can be paired - opening, closing and content between the pair. Tags can be single, have no content or content is located in the attributes.

The opening tag or single tag can contain required and optional attributes.

tag syntax

There are two required attributes for the img tag - src and alt. img is a special tag called replaced lowercase. There are few analogues (video, object). The browser first loads the html and displays the text from the alt, and then loads the image and replaces the text with that image. If the image upload fails, the text remains on the page.

The size of the text is usually smaller than the image, and therefore, to help the browser, you can specify the optional width and height attributes with the image size we want to see on the screen. The real image can be larger or smaller - the browser will adjust the size to the given one. If you do not specify a size, the browser will insert the image with the actual size of the image.

Attention!!!

The width and height attributes must have values as a number without px.
 
 


Task-
 
 Write two required and two optional attributes in the img tag.

Attribute list:

src: file located at the relative path photo.jpg;
alt: text describing the image Image example;
width: width 200 pixels;
height: height 150 pixels.                                           
______________________________________________________________________________________________________________________




#4    Theory:


UNORDERED LIST.

Attention

The ul and ol tags can only have one type of direct descendant - the li tag.



Task-

Using the tags ul and li list 3 main web technologies. The order of the text must be preserved.

______________________________________________________________________________________________________________________








#5    Theory:

Most tags have a default behavior that can be divided into two groups - inline and block.

A generic block container is div.

The generic inline container is span.

The main properties of block elements are:

the width is determined by the width of the parent;
width and height can be set;
there are line breaks before and after the element;
The main properties of inline elements are:

the width is determined by the width of the content;
width and height can't be set;
line break occurs only after filling the width of the parent element;




Task-

Wrap the button inline tags in div containers with the buttons class so that there are three buttons in two rows and each row starts on a new line.

The order of the button elements must be preserved.


______________________________________________________________________________________________________________________






#6   Theory:



Task-  















                                                   
                                                   
                                                   
                                                   
                                                   
                                                   
                                                   
                                                   
                                                   
                                                   Part 2:

#1 Theory  :
The dl (list) element is similar to the ul and ol elements, with the difference that instead of a single li element inside the dl there are pairs from the title dt and description dd

<h4>Elon Musk's Projects</h4>
<dl>
  <dt>SpaceX</dt>
  <dd>Space Program</dd>
  <dt>Tesla</dt> 
  <dd>Electric self-driving car</dd>
  <dt>Starlink</dt> 
  <dd>Satellite Internet Service Provider for the World</dd>
  <dt>Hyperloop</dt>
  <dd>A Train-In-A-Vacuum-Tube</dd>
  <dt>Neuralink</dt>
  <dd>A brain-computer interface</dd>
</dl>

Elon Musk's Projects
SpaceX
Space Program
Tesla
Electric self-driving car
Starlink
Satellite Internet Service Provider for the World
Hyperloop
A Train-In-A-Vacuum-Tube
Neuralink
A brain-computer interface


Task-

The html editor contains the text, consisting of pairs 'name' and 'description'.

Format this text as a list using the dl, dt and dd tags.
______________________________________________________________________________________________________________________




#2

Theory:    Attention!!

Time in computers is counted in milliseconds, starting from the so-called Unix era - from 0 hours, 0 minutes January 1, 1970
Example:

<p>The webinar will be held <time datetime="2021-05-15 19:00">May 15 at 7 pm</time>.</p>
The webinar will be held May 15 at 7 pm.



Task- 
Add to the time tag a datetime attribute with the value midnight on January 01, 1970 in the format 1970-01-01T00:00
______________________________________________________________________________________________________________________




#3

Theory-

You don't need to memorize character substitutions because there are a lot of them and they are quite easy to find:

Use the keywords to search: unicode html and the name of the desired substitution (or a verbal description of what it looks like).
When searching for the desired answer on the search page, use the keyword HTML Entity, HTML code or mnemonic to select a character set suitable for the html code.
For css, all actions are the same. It is enough to replace html with css in the search.


Task-

To the span element add content - character substitution for registered sign.

______________________________________________________________________________________________________________________





#4


Theory-   

AUDIO.



Task-

Add attributes controls, preload="none" for the tag audio
Add attributes src="https://goit.ua/autocheck/bensound-summer.mp3" and type="audio/mp3" for the tag source.

______________________________________________________________________________________________________________________



#5

Theory-


IMAGE OF THE TABLE FOR LAYOUT

table
List of table tags:

table
caption
thead
tbody
tr
th
td
Text for the table:

What is the difference between block, inline and inline-block
block
inline
inline-block
height determined
by height of content
width determined
by width of parent element
by width of content
Is it possible to set height and width
yes
no
How line wrapping works
always on a new line
only when filling the width of the parent element
An example of creating a table with caption, thead with 3-column headers and tbody with two row.

<table>
  <caption>
    Table name
  </caption>
  <thead>
    <tr>
      <th>Column 1 Header</th>
      <th>Column 2 Header</th>
      <th>Column 3 Header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Row 1 Header</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr>
      <th>Row 2 Header</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
  </tbody>
</table>
Table name
Column 1 Header	Column 2 Header	Column 3 Header
Row 1 Header	Cell	Cell
Row 2 Header	Cell	Cell
An example of a table with the merging of 2 cells after the cell with the text "Row 2 Header".

<table>
  <tr>
    <th>Row 1 Header</th>
    <td>Cell</td>
    <td>Cell</td>
  </tr>
  <tr>
    <th>Row 2 Header</th>
    <td colspan="2">Merging of two cells</td>
  </tr>
</table>
Row 1 Header	Cell	Cell
Row 2 Header	Merging of two cells




Task-

Create a table by its image using tags and the colspan attribute. Move up to the table.


______________________________________________________________________________________________________________________








