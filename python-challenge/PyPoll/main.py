import pandas as pd
import os
import csv
total_votes = 0
candidates_list = []
name_list = []
my_list = []
winner = ''
winner_votes = 0



csv_path = os.path.join("election_data.csv")


with open(csv_path, newline='') as csv_file:

	csv_data = csv.reader(csv_file, delimiter = ',')
    # print(csv_data)

	csv_header = next(csv_data)
    # print(f"csv_header: {csv_header}")


	for row in csv_data:
		total_votes += 1
		name_list.append(row[2])

		if row[2]  not in candidates_list:
			candidates_list.append(row[2])
				
		
	for candidate in candidates_list:
		my_list.append([candidate, name_list.count(candidate), round(name_list.count(candidate)/total_votes * 100 , 3)])
		
	for i in my_list:
		if i[1] > winner_votes:
			winner_votes = i[1]
			winner = i[0]


	print("Election Results" '\n' '--------------------------------------')
	print(f'Total Votes: {total_votes}' '\n' '--------------------------------------')

	for i in my_list:
		print(f"{i[0]} : {i[1]}  ({i[2]}00%)")
	
	print('--------------------------------------')
	print(f"Winner : {winner}")
	print('--------------------------------------')

	
output_file_path = ('Election Results.txt')

with open(output_file_path, 'w') as file:

	file.write("Election Results" '\n' '--------------------------------------' '\n')
	file.write(f'Total Votes: {total_votes}' '\n' '--------------------------------------''\n')

	for i in my_list:
		file.write(f"{i[0]} : {i[1]}  ({i[2]}00%)"'\n')
	
	file.write('--------------------------------------''\n')
	file.write(f"Winner : {winner}"'\n')
	file.write('--------------------------------------')

		
