# Autocheck-Solutions

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








