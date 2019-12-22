import os
import csv
total_months = 0
total = 0
average_change = 0
average_change_list = []
previous_revenue = 0
greatest_increase = 0
greatest_increase_month = ''
greatest_decrease = 0
greatest_decrease_month = ''
av = 0

csv_path = os.path.join('budget_data.csv')

with open(csv_path, newline='') as csv_file:

    csv_data = csv.reader(csv_file, delimiter = ',')
    # print(csv_data)

    csv_header = next(csv_data)
    # print(f"csv_header: {csv_header}")

    
    for row in csv_data:
        total_months +=1
        total += int(row[1]) 

        if total_months == 1:
            average_change = 0
        else:
            average_change = int(row[1]) - previous_revenue

        # print(total_months, int(row[1]), previous_revenue, av)

        average_change_list.append(average_change)

        print(total_months,  average_change)


        if greatest_increase < average_change:
            greatest_increase = average_change
            greatest_increase_month = row[0]

        
        if greatest_decrease > average_change:
            greatest_decrease = average_change
            greatest_decrease_month = row[0]


        previous_revenue = int(row[1])
        average_change = 0

    revenue_average_change = round(sum(average_change_list)/(len(average_change_list)-1), 2)

    print("Financial Analysis" '\n' '--------------------------------------')
    print(f'Total Months: {total_months}')
    print(f"Total: ${total}")
    print(f"Average  Change: ${revenue_average_change}") 
    print(f"Greatest Increase in Profits: {greatest_increase_month} (${greatest_increase})")
    print(f"Greatest Decrease in Profits: {greatest_decrease_month} (${greatest_decrease})")




output_file_path = ('Financial Analysis.txt')

with open(output_file_path, 'w') as file:

    file.write("Financial Analysis" '\n' '--------------------------------------' '\n')
    file.write(f'Total Months: {total_months}''\n')
    file.write(f"Total: ${total}"'\n')
    file.write(f"Average  Change: ${revenue_average_change}"'\n') 
    file.write(f"Greatest Increase in Profits: {greatest_increase_month} (${greatest_increase})"'\n')
    file.write(f"Greatest Decrease in Profits: {greatest_decrease_month} (${greatest_decrease})"'\n')

